import React, { createRef, useEffect, useState, useRef } from "react";
import {
  Color,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  SphereGeometry,
} from "three";
import { IFCBEAM, IFCCOLUMN } from "web-ifc";
import { IfcViewerAPI } from "web-ifc-viewer";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import { Upload, Blend } from "lucide-react";
import { DropdownMenu } from "./ui/dropdown-menu";
import ViewDropdown from "./ViewDropdown";

interface Props {
  isTransparent: boolean;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTransparent: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Ifc({
  isTransparent,
  setLoading,
  loading,
  setIsTransparent,
}: Props) {
  const ifcContainerRef = createRef<HTMLDivElement>();
  const [ifcViewer, setIfcViewer] = useState<IfcViewerAPI>();
  const inputRef = useRef<any>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ifcModel, setIfcModel] = useState<any>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [originMaterial, setOriginMaterial] = useState<any>();
  const [viewMode, setViewMode] = useState("normal");


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
        setOriginMaterial(model.material);
      });
      setIfcViewer(ifcViewer);
    }
  }, []);

  useEffect(() => {
    if (!ifcModel) return;
    console.log(originMaterial, ifcModel.material);

    switch (viewMode) {
      case "transparent":
        ifcModel.material = new MeshLambertMaterial({
          // color: 0xffffff,
          transparent: true,
          opacity: 0.5,
        });
        break;
      case 'normal':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ifcModel.material = originMaterial.map(
          (oM: any) => new MeshLambertMaterial(oM)
        );
        break

    }
  }, [viewMode]);

  const ifcOnLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e && e.target && e.target.files && e.target.files[0];
    if (file && ifcViewer) {
      ifcViewer.context.scene.removeModel(ifcModel!);
      console.log("loading file", file);
      setLoading(true);
      const ifcURL = URL.createObjectURL(file);

      const model = await ifcViewer.IFC.loadIfcUrl(ifcURL, true);
      setIfcModel(model);
      if (model) {
        setLoading(false);
      }
      console.log(model.material);
      setOriginMaterial(model.material);

      // Set transparent material
      // eslint-disable-next-line no-constant-condition
      // if (isTransparent) {
      //   model.material = new MeshLambertMaterial({
      //     color: 0xffffff,
      //     transparent: true,
      //     opacity: 0.5,
      //   });
      // }

      // Render shadow
      // await ifcViewer.shadowDropper.renderShadow(model.modelID);

      // const beams = await getIfcElementsByType(model.modelID, IFCBEAM);
      // const columns = await getIfcElementsByType(model.modelID, IFCCOLUMN);
    }
  };

  function markCollisionPoint(collisionPoint: THREE.Vector3) {
    const geometry = new SphereGeometry(1, 32, 32);
    const material = new MeshBasicMaterial({ color: 0xff0000 });
    const sphere = new Mesh(geometry, material);
    sphere.position.copy(collisionPoint);

    // Add the sphere to the viewer's scene
    ifcViewer!.context.scene.add(sphere);
  }

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

  const uploadIfcFile = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="h-[80vh]">
      <div ref={ifcContainerRef} className="h-full" />

      {/* <div className="grid w-full max-w-sm items-center gap-1.5">
          <Input id="picture" type="file" accept=".ifc" onChange={ifcOnLoad}  />
        </div> */}
      <div className="flex items-center gap-2 py-2">
        <Button
          variant="default"
          size="default"
          onClick={() => uploadIfcFile()}
        >
          <Upload />
          <span>Upload Model</span>
        </Button>
        <ViewDropdown setValue={setViewMode} value={viewMode}/>
        <Button onClick={() => setViewMode(viewMode === 'transparent' ? 'normal' : 'transparent' )} className="capitalize">
          <Blend />
          {viewMode}
        </Button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".ifc"
        onChange={ifcOnLoad}
        className="hidden"
      />
      {/* <Input type="file" accept=".ifc" onChange={ifcOnLoad} /> */}
    </div>
  );
}
