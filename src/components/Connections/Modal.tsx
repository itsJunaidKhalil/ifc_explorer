import {
  AlertDialog as Dialog,
  AlertDialogContent as DialogContent,
  AlertDialogFooter as DialogFooter,
  AlertDialogHeader as DialogHeader,
  AlertDialogTitle as DialogTitle,
  AlertDialogDescription as DialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import React, { useReducer, useState } from "react";
// import MyTable2 from "../tables/MyTable2";
import { Configuration, Connection } from "@/interfaces";
import ModalOptions from "./ModalOptions";
import { AppAction } from "@/App";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { SquareArrowOutUpRight } from "lucide-react";

const configurations: Configuration[] = [
  {
    id: 1,
    name: "PC® Beam Shoe",
    count: 0,
    selected: false,
  },
  {
    id: 2,
    name: "BECO® Beam Shoe",
    count: 0,
    selected: false,
  },
  {
    id: 3,
    name: "UKT® Corner Protector",
    count: 0,
    selected: false,
  },
  {
    id: 4,
    name: "KKT Corner Protector",
    count: 0,
    selected: false,
  },
  {
    id: 5,
    name: "WELDA® Anchor Plate",
    count: 0,
    selected: false,
  },
  {
    id: 6,
    name: "KL Anchor Plate",
    count: 0,
    selected: false,
  },
];

export type ModalAction =
  | {
      type: "change_value";
      id: number;
      new_count: number;
    }
  | {
      type: "toggle_select";
      id: number;
    }
  | { type: "ADD_CONFIGURATION"; payload: Configuration }
  | { type: "REMOVE_CONFIGURATION"; payload: number }
  | { type: "RESET" };

function ModalReducer(
  state: Configuration[],
  action: ModalAction
): Configuration[] {
  switch (action.type) {
    case "ADD_CONFIGURATION":
      return [...state, action.payload];
    case "REMOVE_CONFIGURATION":
      return state.filter((config) => config.id !== action.payload);
    case "RESET":
      return [...configurations];
    case "change_value":
      const newChangeState = state.map((conf) => {
        if (conf.id != action.id) return conf;
        else if (conf.id == action.id)
          return { ...conf, count: action.new_count };
      });
      if (newChangeState.length == 0) return [];

      return newChangeState as Configuration[];
    case "toggle_select":
      const newSelectState = state.map((conf) => {
        if (conf.id != action.id) return conf;
        else if (conf.id == action.id)
          return { ...conf, selected: !conf.selected };
      });
      if (newSelectState.length == 0) return [];

      return newSelectState as Configuration[];
    default:
      return state;
  }
}

interface Props {
  con: Connection;
  appDispatch?: React.Dispatch<AppAction>;
}

function cap(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export default function Modal({ con, appDispatch }: Props) {
  const { from, to, fromMaterial, toMaterial } = con;
  const [state, dispatch] = useReducer(ModalReducer, configurations);

  const defaultName = cap(from) + " to " + cap(to) + " configuration";

  const [name, setName] = useState(defaultName);
  const [open, setOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [selectedConfigs, setSelectedConfigs] = useState<Configuration[]>();

  const getLink = (from: string, to: string) => {
    if (from === "COLUMN" && to === "FOUNDATION") {
      return "https://www.prodlib.com/search?q=column&cv=7a27fe8025ba4f7f9493c8e3560c75f3&lang=en";
    } else if (from === "COLUMN" && to === "BEAM") {
      return "https://www.prodlib.com/search?q=column&cv=cea7b7184702477a8af6362aea93d3e9&lang=en";
    } else if (from === "BEAM" && to === "FOUNDATION") {
      return "https://www.prodlib.com/search?q=beam&q=foundation&lang=en";
    } else if (from === "COLUMN" && to === "COLUMN") {
      return "https://www.prodlib.com/search?q=column&lang=en";
    } else if (from === "FOUNDATION" && to === "FOUNDATION") {
      return "https://www.prodlib.com/search?q=foundation&lang=en";
    } else {
      return "https://www.prodlib.com/search?q=beam&lang=en";
    }
  };
  return (
    <div className="flex flex-col items-start gap-4">
      <Button onClick={() => setOpen(true)}>Select</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>
                New configuration for {cap(from)} to {cap(to)}
              </span>
              <a href={`${getLink(from, to)}`} target="blank">
                <SquareArrowOutUpRight className="cursor-pointer" />
              </a>
            </DialogTitle>
            <DialogDescription>
              <Badge variant="secondary" className="text-xs">
                {cap(fromMaterial)} to {cap(toMaterial)}
              </Badge>
            </DialogDescription>
          </DialogHeader>

          <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
            <Label htmlFor="name">Name</Label>
            <span className="text-gray-500 text-xs">
              Please enter the name of the configuration
            </span>
            <Input
              id="name"
              value={name}
              onInput={(e) => {
                const { value } = e.target as unknown as { value: string };
                setName(value);
              }}
              placeholder="Configuration Name"
              className="min-w-full"
            ></Input>
          </div>
          <Label className="-mb-3">Components</Label>
          <span className="-mb-2 text-gray-500 text-xs">
            Select which components you want for your configuration
          </span>
          <div className="overflow-y-auto max-h-[60vh]">
            <ModalOptions configurations={state} confDispatch={dispatch} />
          </div>
          <DialogFooter className="">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const out = state.filter((val) => val.selected);

                if (appDispatch) {
                  // LOGIC HERE FOR RETURNING SELECTED COMPONENTS FOR CONFIGURATION
                  appDispatch({
                    type: "add_components",
                    conn_comp: {
                      id: 0,
                      name: name ?? "New Configuration",
                      count: 1,
                      components: [...out],
                      connection: { ...con },
                    },
                  });
                  dispatch({type:"RESET"})

                  console.log(out);
                }
                setOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
