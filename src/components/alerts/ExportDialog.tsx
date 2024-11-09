import {
  AlertDialog as Dialog,
  AlertDialogContent as DialogContent,
  AlertDialogFooter as DialogFooter,
  AlertDialogHeader as DialogHeader,
  AlertDialogTitle as DialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import MyTable2 from "../tables/MyTable2";
import { ConnComp } from "@/interfaces";
import { AppAction } from "@/App";

export interface Configuration {
  id: number;
  name: string;
  status: "Paid" | "Pending" | "Unpaid";
  count: number;
}

interface Props {
  connection_comps: ({ id: number } & ConnComp)[];
  appDispatch: React.Dispatch<AppAction>;
}

export default function ExportDialog({ connection_comps, appDispatch }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSelectedConfigs(connection_comps)
  }, [connection_comps])

  const [rows, setRows] = useState<Record<number, boolean>>({})

  useEffect(() => {
    console.log(Object.keys(rows).length)
    if (Object.keys(rows).length !== 0) {
      setTimeout(() => {
        window.print();
        console.log("⸮Queres?")
      }, 100)
    }
  }, [rows])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedConfigs, setSelectedConfigs] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useState<any[]>(connection_comps);
  return (
    <div className="flex flex-col items-start gap-4">
      <Button onClick={() => setOpen(true)} disabled={connection_comps.length === 0}>Export</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Export configurations</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh] border rounded-md">
              <MyTable2 configurations={selectedConfigs} appDispatch={appDispatch} defaultExpandedRows={rows}/>
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setRows(selectedConfigs.reduce((accumulator: Record<number, boolean>, c: ({ id: number } & ConnComp)) => {
                  const aValue = accumulator;
                  aValue[c.id] = true;
                  return aValue
                }, {}));
              }}
            >
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
