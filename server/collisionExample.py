# example of how to use the clash_collision_many method to find clashes between beams and columns
# and create a new IFC file with the clashes as ...walls... (shrug) in the same location as the clash

# partly copied and modified from ifcOpenShell's example code

import json
import multiprocessing
import numpy
import ifcopenshell
import ifcopenshell.util.placement
import ifcopenshell.util.element
import ifcopenshell.geom
import ifcopenshell.api.root
import ifcopenshell.api.unit
import ifcopenshell.api.context
import ifcopenshell.api.project
import ifcopenshell.api.geometry

# Introduce some variables to store the beam and column entities
beamList = []
columnList = []
footingList = []
beamCount = 0
columnCount = 0
footingCount = 0

# Load the IFC file
model = ifcopenshell.open("./uploads/DummyModel.ifc")

# Create a
tree = ifcopenshell.geom.tree()

# We want our representation to be the 3D body of the element.
# This representation context is only created once per project.
# You must reuse the same body context every time you create a new representation.
model3d = ifcopenshell.api.context.add_context(model, context_type="Model")
body = ifcopenshell.api.context.add_context(
    model,
    context_type="Model",
    context_identifier="Body",
    target_view="MODEL_VIEW",
    parent=model3d,
)

# These vertices and faces represent a .2m square .5m high upside down pyramid in SI units.
# Note how they are nested lists. Each nested list represents a "mesh". There may be multiple meshes.
vertices = [
    [
        (0.0, 0.0, 0.5),
        (0.0, 0.2, 0.5),
        (0.2, 0.2, 0.5),
        (0.2, 0.0, 0.5),
        (0.1, 0.1, 0.0),
    ]
]
faces = [[(0, 1, 2, 3), (0, 4, 1), (1, 4, 2), (2, 4, 3), (3, 4, 0)]]
representation = ifcopenshell.api.geometry.add_mesh_representation(
    model, context=body, vertices=vertices, faces=faces
)

beams = model.by_type("IfcBeam")
columns = model.by_type("IfcColumn")
footings = model.by_type("IfcFooting")

for beam in beams:
    beamList.append(beam.id())
    beamCount += 1
print("Beam count: ", beamCount)

for column in columns:
    columnList.append(column.id())
    columnCount += 1
print("Column count: ", columnCount)

for footing in footings:
    footingList.append(footing.id())
    footingCount += 1
print("footing count: ", footingCount)

settings = ifcopenshell.geom.settings()
iterator = ifcopenshell.geom.iterator(
    settings, model, multiprocessing.cpu_count(), include=columns + beams + footings
)

if iterator.initialize():
    while True:
        # Use triangulation to build a BVH tree
        tree.add_element(iterator.get())
        if not iterator.next():
            break


if len(columns) != 0 and len(beams) != 0:
    columns_to_beams_clashes = tree.clash_collision_many(
        columns,
        beams,
        allow_touching=True,  # Include results where faces merely touch but do not intersect
    )

if len(columns) != 0:
    columns_to_columns_clashes = tree.clash_collision_many(
        columns,
        columns,
        allow_touching=True,  # Include results where faces merely touch but do not intersect
    )

# columns_to_footing_clashes = tree.clash_collision_many(
#     columns,
#     footings,
#     allow_touching=True,  # Include results where faces merely touch but do not intersect
# )


def get_materials(element_id, model):
    element = model.by_id(element_id)
    if not element:
        return ["Element not found in model"]

    materials = []

    # Check associations directly
    for assoc in model.by_type("IfcRelAssociatesMaterial"):
        if element in assoc.RelatedObjects:
            material = assoc.RelatingMaterial
            if material.is_a("IfcMaterialLayerSetUsage"):
                materials.extend(
                    layer.Material.Name for layer in material.ForLayerSet.MaterialLayers
                )
            elif material.is_a("IfcMaterialProfileSet"):
                materials.extend(
                    profile.Material.Name for profile in material.MaterialProfiles
                )
            elif material.is_a("IfcMaterial"):
                materials.append(material.Name)
            else:
                materials.append("Unknown material structure")

    return materials or ["No material found"]


def handle_clash_with_unique_keys(clashes, model):
    clash_data = {}  # Dictionary to store clash data, keyed by material pairs

    for i, clash in enumerate(clashes):
        # Get the unique IDs of each clash element
        element_a_id = clash.a.id()
        element_b_id = clash.b.id()

        # Retrieve materials using these IDs
        materials_a = get_materials(element_a_id, model)
        materials_b = get_materials(element_b_id, model)

        # Sort materials to create a consistent key, regardless of order
        clash_key = tuple(sorted([tuple(materials_a), tuple(materials_b)]))

        # Get the coordinates of the clash
        x, y, z = list(clash.p1)[:3]
        coordinates = (x, y, z)

        # If this clash key doesn't exist in the dictionary, add it
        if clash_key not in clash_data:
            clash_data[clash_key] = {
                "materials": sorted(list(set(materials_a + materials_b))),
                "coordinates": [coordinates],
            }
        else:
            # If clash key exists, only add unique coordinates
            if coordinates not in clash_data[clash_key]["coordinates"]:
                clash_data[clash_key]["coordinates"].append(coordinates)

    return clash_data


def print_clash_data(clash_data):
    for clash_key, data in clash_data.items():
        materials = ", ".join(data["materials"])  # Join materials in a readable way
        coordinates = ", ".join(
            f"({x:.2f}, {y:.2f}, {z:.2f})" for x, y, z in data["coordinates"]
        )  # Format coordinates with 2 decimal places

        print(f"Clash between materials: {materials}:")
        print(f"  Coordinates: {coordinates}")
        print("-" * 50)  # Separator for clarity


# Assuming `columns_to_beams_clashes` is already populated
ctb_out = handle_clash_with_unique_keys(columns_to_beams_clashes, model)

print(ctb_out)
# Use the function to print the clash data
print_clash_data(ctb_out)

# Assuming `columns_to_beams_clashes` is already populated
ctc_out = handle_clash_with_unique_keys(columns_to_columns_clashes, model)

# Use the function to print the clash data
print_clash_data(ctc_out)


def write_clash_data_to_json(clash_data, filename="clash_data.json"):
    # Ensure that the top-level keys are strings, and nested clash data also has string keys
    formatted_clash_data = {}

    # Convert the top-level keys to strings (if they are not already)
    for key, value in clash_data.items():
        # Ensure top-level keys are strings
        if isinstance(key, tuple):  # Convert tuple keys into string keys
            key = str(key)

        # Format the clash data for each category (e.g., COLUMN_COLUMN or COLUMN_BEAM)
        formatted_clash_data[key] = {}

        # If the value is a dictionary (which is expected for clash pairs), convert its keys
        if isinstance(value, dict):
            for inner_key, inner_value in value.items():
                if isinstance(inner_key, tuple):  # Convert inner tuple keys to string
                    inner_key = str(inner_key)
                formatted_clash_data[key][inner_key] = inner_value

    # Convert the formatted clash data to a JSON string with indents for readability
    clash_data_json = json.dumps(formatted_clash_data, indent=4)

    # Write the JSON data to a file
    with open(filename, "w") as f:
        f.write(clash_data_json)


# Assuming `ctb_out` is the clash data obtained earlier

# write_clash_data_to_json({"COLUMN_COLUMN": ctc_out, "COLUMN_BEAM": ctb_out})


def format_clash_data_for_output(*clash_data_dicts):
    """
    Formats clash data for each category and returns a dictionary for JSON output.
    Arguments:
        clash_data_dicts (dict): Key-value pairs where the key is the clash category (e.g., 'COLUMN_BEAM')
                                  and the value is a list of clash coordinates.
    Returns:
        dict: A dictionary of formatted clash data.
    """
    formatted_data = {}

    # Loop through each clash data dictionary and format it
    for clash_category, clash_data in clash_data_dicts:
        # Format the list of coordinates for the clash category
        formatted_data[clash_category] = []
        for clash in clash_data:
            x, y, z = clash
            formatted_data[clash_category].append([x, y, z])

    return formatted_data


def write_clash_data_to_json(clash_data, filename="clash_data.json"):
    """
    Write the clash data to a JSON file.
    Arguments:
        clash_data (dict): The formatted clash data.
        filename (str): The output filename.
    """
    formatted_clash_data = {}
    for key, value in clash_data.items():
        # Convert the tuple key to a string key
        string_key = str(key)
        formatted_clash_data[string_key] = value

    # Write to JSON
    with open(filename, "w") as f:
        json.dump(formatted_clash_data, f, indent=4)


# Example clash data for each category:
ctb_out = [
    [36.2, 18.0, 6.99],
    [36.2, 18.0, 3.39],
    [36.2, 12.0, 6.99],
    [36.2, 12.2, 6.99],
]
ctc_out = [[35.5, 20.0, 5.25], [35.6, 20.1, 5.40], [35.7, 19.8, 5.30]]
b_b_out = [[34.0, 14.0, 7.50], [33.5, 14.5, 7.25]]
b_f_out = [[30.0, 20.5, 6.75], [30.2, 20.6, 6.80]]
f_f_out = [[29.0, 19.5, 4.55], [29.5, 19.7, 4.45]]
c_f_out = [[31.5, 22.0, 5.15], [31.8, 22.2, 5.10]]

# Format clash data for each category
formatted_clash_data = format_clash_data_for_output(
    ("COLUMN_COLUMN", ctc_out),
    ("COLUMN_BEAM", ctb_out),
    ("BEAM_BEAM", b_b_out),
    ("BEAM_FOOTING", b_f_out),
    ("FOOTING_FOOTING", f_f_out),
    ("COLUMN_FOOTING", c_f_out),
)

# Write the formatted clash data to a JSON file
write_clash_data_to_json(formatted_clash_data, filename="formatted_clash_data.json")


# ctb_coordinates = []
# ctb_out = handle_clash(columns_to_beams_clashes, model)


# # ctb_coordinates.append()
# # print(ctb_out)
# def print_clash_data(clash_data):
#     for clash_key, data in clash_data.items():
#         element_a_id, element_b_id = clash_key
#         materials = ", ".join(data["materials"])  # Join materials in a readable way
#         coordinates = ", ".join(
#             f"({x:.2f}, {y:.2f}, {z:.2f})" for x, y, z in data["coordinates"]
#         )  # Format coordinates with 2 decimal places

#         print(
#             f"Clash between Element A (ID: {element_a_id}) and Element B (ID: {element_b_id}):"
#         )
#         print(f"  Materials: {materials}")
#         print(f"  Coordinates: {coordinates}")
#         print("-" * 50)  # Separator for clarity


# # Use the function to print the clash data
# print_clash_data(ctb_out)

# ctc_coordinates = []
# ctc_out = handle_clash(columns_to_columns_clashes, model)
# ctc_coordinates.append()

cbClashes = len(columns_to_beams_clashes)
ccClashes = len(columns_to_columns_clashes)

print("Column to Beam clashes: ", (cbClashes))
print("Column to Column clashes: ", (ccClashes))
