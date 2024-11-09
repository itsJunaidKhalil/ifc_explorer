import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { ConnComp } from "@/interfaces";
import { AppAction } from "@/App";

interface Props {
  configurations: ({ id: number } & ConnComp)[];
  appDispatch?: React.Dispatch<AppAction>
}
const MyTable2 = ({ configurations, appDispatch }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [checked, setChecked] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function toggleConfig(id: number) {
    if (appDispatch) appDispatch({
      type: "remove_component",
      id: id
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function updateCount(id: number, v: boolean) {

  }

  const totalAmount = configurations.length;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Select</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {configurations.map((config) => (
          <TableRow key={config.id}>
            <TableCell>
              <Checkbox
                checked={true}
                onCheckedChange={() => toggleConfig(config.id)}
              />
            </TableCell>
            <TableCell>{config.name}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateCount(config.id, false)}
                // disabled={config.count === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{config.id}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateCount(config.id, true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell colSpan={2} className="font-medium">
            Total
          </TableCell>
          <TableCell colSpan={2} className="text-right font-medium">
            {totalAmount.toLocaleString()}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default MyTable2;
