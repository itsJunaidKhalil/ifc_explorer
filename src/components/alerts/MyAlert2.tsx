import {
  AlertDialog as Dialog,
  AlertDialogContent as DialogContent,
  AlertDialogFooter as DialogFooter,
  AlertDialogHeader as DialogHeader,
  AlertDialogTitle as DialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import MyTable2 from "../tables/MyTable2";
import { ConnComp } from "@/interfaces";
import { AppAction } from "@/App";

export interface Configuration {
  id: number
  name: string
  status: "Paid" | "Pending" | "Unpaid"
  count: number
}

const configurations: Configuration[] = [
  {
    id: 1,
    name: "INV001",
    status: "Paid",
    count: 250,
  },
  {
    id: 2,
    name: "INV002",
    status: "Pending",
    count: 150,
  },
  {
    id: 3,
    name: "INV003",
    status: "Unpaid",
    count: 350,
  },
  {
    id: 4,
    name: "INV004",
    status: "Paid",
    count: 450,
  },
  {
    id: 5,
    name: "INV005",
    status: "Paid",
    count: 550,
  },
];

interface Props {
  connection_comps: ({ id: number } & ConnComp)[]
  appDispatch?: React.Dispatch<AppAction>
}

export default function MyAlert2({ connection_comps, appDispatch }: Props) {

  const [open, setOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedConfigs, setSelectedConfigs] = useState<Configuration[]>(configurations);
  return (
    <div className="flex flex-col items-start gap-4">
      <Button onClick={() => setOpen(true)}>Show Cart</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Configurations for checkout</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh]">
            <MyTable2 configurations={connection_comps} appDispatch={appDispatch} />
          </div>
          <DialogFooter className="sm:justify-start gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log(
                  "Selected configurations:",
                  configurations.filter(
                    (config) =>
                      selectedConfigs.some(c => c.id === config.id) && config.count > 0
                  )
                );
                setOpen(false);
              }}
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
