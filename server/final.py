import json
import multiprocessing
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
model = ifcopenshell.open("./uploads/3_Floors.ifc")

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
# Initialize the settings for the geometry iterator
settings = ifcopenshell.geom.settings()

# Create a tree to store the BVH (Bounding Volume Hierarchy) elements
tree = ifcopenshell.geom.tree()

beams = model.by_type("IfcBeam")
columns = model.by_type("IfcColumn")
footings = model.by_type("IfcFooting")

# Create the iterator for the geometry of the elements (columns, beams, footings)
iterator = ifcopenshell.geom.iterator(
    settings, model, multiprocessing.cpu_count(), include=columns + beams + footings
)

# Initialize the iterator and populate the tree
if iterator.initialize():
    while True:
        # Use triangulation to build a BVH tree
        tree.add_element(iterator.get())
        if not iterator.next():
            break

# Clash detection for different pairs of elements
clash_results = {
    "COLUMN_BEAM": [],
    "COLUMN_COLUMN": [],
    "COLUMN_FOOTING": [],
    "BEAM_BEAM": [],
    "BEAM_FOOTING": [],
    "FOOTING_FOOTING": [],
}

# Column to Beam clashes
if len(columns) != 0 and len(beams) != 0:
    columns_to_beams_clashes = tree.clash_collision_many(
        columns,
        beams,
        allow_touching=True,  # Include results where faces merely touch but do not intersect
    )
    clash_results["COLUMN_BEAM"] = columns_to_beams_clashes

# Column to Column clashes
if len(columns) != 0:
    columns_to_columns_clashes = tree.clash_collision_many(
        columns,
        columns,
        allow_touching=True,  # Include results where faces merely touch but do not intersect
    )
    clash_results["COLUMN_COLUMN"] = columns_to_columns_clashes

# Column to Footing clashes
if len(columns) != 0 and len(footings) != 0:
    columns_to_footings_clashes = tree.clash_collision_many(
        columns,
        footings,
        allow_touching=True,  # Include results where faces merely touch but do not intersect
    )
    clash_results["COLUMN_FOOTING"] = columns_to_footings_clashes

# Beam to Beam clashes
if len(beams) != 0:
    beams_to_beams_clashes = tree.clash_collision_many(
        beams,
        beams,
        allow_touching=True,  # Include results where faces merely touch but do not intersect
    )
    clash_results["BEAM_BEAM"] = beams_to_beams_clashes

# Beam to Footing clashes
if len(beams) != 0 and len(footings) != 0:
    beams_to_footings_clashes = tree.clash_collision_many(
        beams,
        footings,
        allow_touching=True,  # Include results where faces merely touch but do not intersect
    )
    clash_results["BEAM_FOOTING"] = beams_to_footings_clashes

# Footing to Footing clashes
if len(footings) != 0:
    footings_to_footings_clashes = tree.clash_collision_many(
        footings,
        footings,
        allow_touching=True,  # Include results where faces merely touch but do not intersect
    )
    clash_results["FOOTING_FOOTING"] = footings_to_footings_clashes

# Now `clash_results` contains all the clash data for each category:
# clash_results = {
#     'COLUMN_BEAM': [...],
#     'COLUMN_COLUMN': [...],
#     'COLUMN_FOOTING': [...],
#     'BEAM_BEAM': [...],
#     'BEAM_FOOTING': [...],
#     'FOOTING_FOOTING': [...],
# }


def process_clashes(clashes):
    coordinates = []
    for i, clash in enumerate(clashes):

        x, y, z = list(clash.p1)[:3]
        coordinates.append([x, y, z])

    return coordinates


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


# Process each clash type with a conditional check

# COLUMN_BEAM clashes
if clash_results["COLUMN_BEAM"]:
    ctb_out = process_clashes(clash_results["COLUMN_BEAM"])
else:
    ctb_out = []

# COLUMN_COLUMN clashes
if clash_results["COLUMN_COLUMN"]:
    ctc_out = process_clashes(clash_results["COLUMN_COLUMN"])
else:
    ctc_out = []

# COLUMN_FOOTING clashes
if clash_results["COLUMN_FOOTING"]:
    c_f_out = process_clashes(clash_results["COLUMN_FOOTING"])
else:
    c_f_out = []

# BEAM_BEAM clashes
if clash_results["BEAM_BEAM"]:
    b_b_out = process_clashes(clash_results["BEAM_BEAM"])
else:
    b_b_out = []

# BEAM_FOOTING clashes
if clash_results["BEAM_FOOTING"]:
    b_f_out = process_clashes(clash_results["BEAM_FOOTING"])
else:
    b_f_out = []

# FOOTING_FOOTING clashes
if clash_results["FOOTING_FOOTING"]:
    f_f_out = process_clashes(clash_results["FOOTING_FOOTING"])
else:
    f_f_out = []


# Format clash data for each category
# Format clash data for each category by passing each category and its data as a tuple
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
