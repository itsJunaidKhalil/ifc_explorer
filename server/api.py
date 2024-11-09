# from flask import Flask, request, jsonify
# import os

# app = Flask(__name__)
# UPLOAD_FOLDER = "uploads"
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# @app.route("/upload", methods=["POST"])
# def upload_file():
#     if "file" not in request.files:
#         return jsonify({"error": "No file part in the request"}), 400
#     file = request.files["file"]
#     if file.filename == "":
#         return jsonify({"error": "No selected file"}), 400
#     file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
#     file.save(file_path)
#     return (
#         jsonify({"message": "File uploaded successfully", "file_path": file_path}),
#         200,
#     )


# def start_server():
#     app.run(debug=True)

from flask import Flask, request, jsonify
from waitress import serve
import ifcopenshell
import ifcopenshell.util.placement
import ifcopenshell.util.element
import ifcopenshell.geom
import ifcopenshell.api.root
import ifcopenshell.api.unit
import ifcopenshell.api.context
import ifcopenshell.api.project
import ifcopenshell.api.geometry
import numpy
import os

app = Flask(__name__)


@app.route("/upload", methods=["POST"])
def upload_ifc():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    filename = "./uploads/" + file.filename
    file.save(filename)

    # Run clash detection on the uploaded file
    clash_data = run_clash_detection(filename)

    # Send the clash data and output file location as a response
    return jsonify({"clashes": clash_data})


def run_clash_detection(ifc_file_path):

    beamList = []
    columnList = []
    footingList = []
    beamCount = 0
    columnCount = 0
    footingCount = 0

    # Load the IFC model
    model = ifcopenshell.open(ifc_file_path)
    print("WHAT IS HAPPENING")

    # Setup clash detection
    tree = ifcopenshell.geom.tree()
    model3d = ifcopenshell.api.context.add_context(model, context_type="Model")
    body = ifcopenshell.api.context.add_context(
        model,
        context_type="Model",
        context_identifier="Body",
        target_view="MODEL_VIEW",
        parent=model3d,
    )
    print("WHAT IS HAPPENING")

    # Define a placeholder clash representation for the new elements
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

    print("WHAT IS HAPPENING")
    # Retrieve beams, columns, and footings
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

    print("WHAT IS HAPPENING")
    # Initialize iterator and tree for clash detection
    settings = ifcopenshell.geom.settings()
    iterator = ifcopenshell.geom.iterator(
        settings, model, os.cpu_count(), include=columns + beams + footings
    )

    print("WHAT IS HAPPENING")
    if iterator.initialize():
        while True:
            tree.add_element(iterator.get())
            if not iterator.next():
                break

    print("WHAT IS HAPPENING")
    # Perform clash detection
    columns_to_beams_clashes = tree.clash_collision_many(
        columns, beams, allow_touching=True
    )
    # columns_to_footing_clashes = tree.clash_collision_many(
    #     columns, footings, allow_touching=True
    # )

    print("WHAT IS HAPPENING")

    # Collect clash coordinates
    clash_data = {
        "columns_to_beams": [list(clash.p1)[:3] for clash in columns_to_beams_clashes],
        # "columns_to_footings": [
        #     {"p1": list(clash.p1)[:3]} for clash in columns_to_footing_clashes
        # ],
    }

    # Create new IFC entities for each clash
    # matrix = numpy.eye(4)
    # for collision in columns_to_beams_clashes:
    #     matrix[:, 3][0:3] = list(collision.p1)
    #     element = ifcopenshell.api.root.create_entity(model, ifc_class="IfcWall")
    #     ifcopenshell.api.geometry.edit_object_placement(
    #         model, product=element, matrix=matrix
    #     )
    #     ifcopenshell.api.geometry.assign_representation(
    #         model, product=element, representation=representation
    #     )

    # Save the modified IFC model with clashes marked as walls
    # output_file_path = "./uploads/Clashed_" + os.path.basename(ifc_file_path)
    # model.write(output_file_path)

    return clash_data


if __name__ == "__main__":
    serve(
        app,
        host="0.0.0.0",
        port=5000,
        threads=4,
        connection_limit=100,
        channel_timeout=300,
    )  # Set your desired timeout
