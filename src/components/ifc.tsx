import React, { createRef, useEffect, useState } from "react";
import { Color, MeshLambertMaterial } from "three";
import { IFCBEAM, IFCCOLUMN } from "web-ifc";
import { IfcViewerAPI } from "web-ifc-viewer";

export default function () {
  const ifcContainerRef = createRef<HTMLDivElement>();
  const [ifcViewer, setIfcViewer] = useState<IfcViewerAPI>();
  const [ifcModel, setIfcModel] = useState<any>();

  useEffect(() => {
    if (ifcContainerRef.current) {
      const container = ifcContainerRef.current;
      const ifcViewer = new IfcViewerAPI({
        container,
        backgroundColor: new Color(0xffffff),
      });

      ifcViewer.axes.setAxes();

      ifcViewer.IFC.loader.ifcManager.applyWebIfcConfig({
        COORDINATE_TO_ORIGIN: true,
        USE_FAST_BOOLS: true,
      });
      ifcViewer.IFC.loadIfcUrl("/DummyModel.ifc", true).then((model) => {
        setIfcModel(model);
      });
      setIfcViewer(ifcViewer);
    }
  }, []);

  const ifcOnLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e && e.target && e.target.files && e.target.files[0];
    if (file && ifcViewer) {
      ifcViewer.context.scene.removeModel(ifcModel!);
      console.log("loading file", file);

      const ifcURL = URL.createObjectURL(file);

      const model = await ifcViewer.IFC.loadIfcUrl(ifcURL, true);
      setIfcModel(model);

      // Set transparent material
      if (false) {
        model.material = new MeshLambertMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.5,
        });
      }

      // Render shadow
      // await ifcViewer.shadowDropper.renderShadow(model.modelID);

      // const beams = await getIfcElementsByType(model.modelID, IFCBEAM);
      // const columns = await getIfcElementsByType(model.modelID, IFCCOLUMN);
    }
  };

  async function getIfcElementsByType(modelID: number, type: number) {
    const ids = await ifcViewer!.IFC.loader.ifcManager.getAllItemsOfType(
      modelID,
      type,
      false
    );
    const elements: THREE.Mesh[] = [];

    for (const id of ids) {
      const mesh = ifcViewer!.IFC.loader.ifcManager.createSubset({
        modelID,
        ids: [id],
        removePrevious: false,
        material: new MeshLambertMaterial({
          color: 0xffffff,
          transparent: false,
          opacity: 1,
        }),
      });
      elements.push(mesh);
    }

    return elements;
  }

  return (
    <div className="h-full">
      <div ref={ifcContainerRef} className="h-full" />
      <input type="file" accept=".ifc" onChange={ifcOnLoad} />
    </div>
  );
}
