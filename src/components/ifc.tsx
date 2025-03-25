/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createRef, useEffect, useState, useRef } from "react";
import {
  Color,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  SphereGeometry,
  Vector3,
} from "three";
import { IfcViewerAPI } from "web-ifc-viewer";
import { Button } from "./ui/button";
import { Upload, Blend } from "lucide-react";
import ViewDropdown from "./ViewDropdown";
import { AppAction } from "@/App";
import { Connection } from "@/interfaces";
import { Card } from "./ui/card";

interface Props {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  appDispatch: React.Dispatch<AppAction>;
  connections: Connection[];
}

export default function Ifc({ setLoading, appDispatch, connections }: Props) {
  const ifcContainerRef = createRef<HTMLDivElement>();
  const [ifcViewer, setIfcViewer] = useState<IfcViewerAPI>();
  const inputRef = useRef<any>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ifcModel, setIfcModel] = useState<any>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [originMaterial, setOriginMaterial] = useState<any>();
  const [viewMode, setViewMode] = useState("transparent");

  const [connectionGroups] = useState({} as any);

  const [filename, setFilename] = useState("DummyModel.ifc");

  const [usePreset, setUsePreset] = useState(true);

  useEffect(() => {
    if (ifcContainerRef.current) {
      const container = ifcContainerRef.current;
      const ifcViewer = new IfcViewerAPI({
        container,
        backgroundColor: new Color(0xffffff),
      });

      ifcViewer.axes.setAxes();

      ifcViewer.IFC.loader.ifcManager.applyWebIfcConfig({
        COORDINATE_TO_ORIGIN: false,
        USE_FAST_BOOLS: true,
      });
      setIfcViewer(ifcViewer);
      setFilename("DummyModel.ifc");
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
      case "normal":
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ifcModel.material = originMaterial.map(
          (oM: any) => new MeshLambertMaterial(oM)
        );
        break;
    }
  }, [viewMode, ifcModel]);

  useEffect(() => {
    connections.forEach((connection) => {
      (connectionGroups as any)[connection.key]?.forEach(
        (mesh: any) => (mesh.visible = connection.visible)
      );
    });
  }, [connections]);

  
const ifcOnLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Function to extract hierarchy from IFC
    const getHierarchy = async (ifcModel: any) => {
        const hierarchy = await ifcViewer!.IFC.loader.ifcManager.getSpatialStructure(ifcModel.modelID);
        console.log("IFC Hierarchy:", hierarchy);
    };

    // Function to extract element details
    const getElementDetails = async (modelID: number, expressID: number) => {
      const properties = await ifcViewer!.IFC.loader.ifcManager.getItemProperties(modelID, expressID);
      return {
          profile: properties.ProfileType || "Unknown",
          material: properties.Material || "Unknown",
          dimensions: properties.Length || properties.Width || properties.Height 
              ? { 
                  length: properties.Length || "N/A", 
                  width: properties.Width || "N/A", 
                  height: properties.Height || "N/A" 
                }
              : null // Return null if no dimensions exist
      };
  };
  

    const file = e && e.target && e.target.files && e.target.files[0];
    if (file && ifcViewer) {
      if (ifcModel) {
        ifcViewer.context.scene.removeModel(ifcModel!);
      }
      setFilename(file.name);
      console.log("loading file", file);
      setUsePreset(false);
      connections.forEach((connection) => {
        (connectionGroups as any)[connection.key]?.forEach((mesh: any) =>
          ifcViewer.context.scene.removeModel(mesh)
        );
        connectionGroups[connection.key] = [];
      });
      setLoading(true);
      const ifcURL = URL.createObjectURL(file);

      const model = await ifcViewer.IFC.loadIfcUrl(ifcURL, true);
      setIfcModel(model);
    
      if (model) {
        setLoading(false);
      }
      setOriginMaterial(model.material);
      loadConnections(file.name);
     
        //addeed
        const getHierarchy = async (ifcModel: any) => {
          const hierarchy = await ifcViewer!.IFC.loader.ifcManager.getSpatialStructure(ifcModel.modelID);
          console.log("IFC Hierarchy:", hierarchy);
      };
      getHierarchy(model);

      //----------------
      const getElementDetails = async (modelID: number, expressID: number) => {
        const properties = await ifcViewer!.IFC.loader.ifcManager.getItemProperties(modelID, expressID);
        return {
            profile: properties.ProfileType || "Unknown",
            material: properties.Material || "Unknown",
            dimensions: {
                length: properties.Length || "N/A",
                width: properties.Width || "N/A",
                height: properties.Height || "N/A"
            }
        };
    };
    console.log(await getElementDetails(ifcModel.modelID, ifcModel.expressID));
    
      //-------------------
      
    }
  };

  useEffect(() => {
    if (!usePreset) {
      return;
    }
    if (ifcViewer) {
      if (filename) {
        if (ifcModel) {
          ifcViewer.context.scene.removeModel(ifcModel!);
        }

        connections.forEach((connection) => {
          (connectionGroups as any)[connection.key]?.forEach((mesh: any) =>
            ifcViewer.context.scene.removeModel(mesh)
          );
          connectionGroups[connection.key] = [];
        });

        setLoading(true);

        ifcViewer.IFC.loadIfcUrl("/" + filename, true)
          .then((model) => {
            setIfcModel(model);
            setOriginMaterial(model.material);
            loadConnections(filename);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [ifcViewer, filename, usePreset]);

  async function loadConnections(filename: string) {
    connections.forEach((connection) => {
      (connectionGroups as any)[connection.key]?.forEach((mesh: any) =>
        ifcViewer!.context.scene.removeModel(mesh)
      );
      connectionGroups[connection.key] = [];
    });
    
    const a: { [key: string]: any } = await fetch(
      "/" + filename + ".json"
    ).then((res) => res.json());

    const connection_amounts = Object.entries(a).map(([key, value]) => {
      return {
        key: key,
        amount: value.length,
      };
    });
    appDispatch({
      type: "set_connection_amounts",
      connection_amounts: connection_amounts,
    });

    Object.entries(a).forEach(([key, value]) => {
      const color = connections.find((c) => c.key === key)!.color;
      connectionGroups[key] = value.map((v: any) =>
        markCollisionPoint(new Vector3(v[0], v[2], -v[1]), color)
      );
    });
  }

  function markCollisionPoint(collisionPoint: THREE.Vector3, color: string) {
    const geometry = new SphereGeometry(0.2, 32, 32);
    const material = new MeshBasicMaterial({ color });
    const sphere = new Mesh(geometry, material);
    sphere.position.copy(collisionPoint);

    // Add the sphere to the viewer's scene
    ifcViewer!.context.scene.add(sphere);
    return sphere;
  }

  const uploadIfcFile = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div>
      <Card className="md:h-[80vh]">
        <div ref={ifcContainerRef} className="h-full" />
      </Card>
      {/* <div className="grid w-full max-w-sm items-center gap-1.5">
          <Input id="picture" type="file" accept=".ifc" onChange={ifcOnLoad}  />
        </div> */}
      <div className="flex items-center gap-2 py-2 flex-wrap">
        <Button
          variant="default"
          size="default"
          onClick={() => uploadIfcFile()}
        >
          <Upload />
          <span>Upload Model</span>
        </Button>
        <ViewDropdown
          setValue={(value: any) => {
            setFilename(value);
            setUsePreset(true);
          }}
          value={filename}
        />
        <Button
          onClick={() =>
            setViewMode(viewMode === "transparent" ? "normal" : "transparent")
          }
          className="capitalize"
        >
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
