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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedConfigs, setSelectedConfigs] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useState<any>(connection_comps);
  return (
    <div className="flex flex-col items-start gap-4">
      <Button onClick={() => setOpen(true)}>Export</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Configurations for checkout</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh]">
              <MyTable2 configurations={selectedConfigs} appDispatch={appDispatch}/>
          </div>
          <DialogFooter className="sm:justify-start gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log(
                  "Selected configurations:",
                  // configurations.filter(
                  //   (config) =>
                  //     selectedConfigs.some((c) => c.id === config.id) &&
                  //     config.count > 0
                  // )
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
