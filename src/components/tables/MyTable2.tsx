import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { ChevronDown, ChevronRight, Minus, Plus } from "lucide-react";
import React, { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { ConnComp } from "@/interfaces";
import { AppAction } from "@/App";

interface Props {
  configurations: ({ id: number } & ConnComp)[];
  appDispatch: React.Dispatch<AppAction>;
}
const MyTable2 = ({ configurations, appDispatch }: Props) => {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const toggleRowExpanded = (rowId: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function toggleConfig(id: number) {
    if (appDispatch)
      appDispatch({
        type: "remove_component",
        id: id,
      });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function updateCount(id: number, operation: string) {
    // const currentConfig = configurations.filter(
    //   (config) => config.id === id
    // )[0];
    switch (operation) {
      case "add":
        appDispatch({
          type: "increment_configuration",
          id: id,
        });
        break;
      case "decrement":
        appDispatch({
          type: "decrement_configuration",
          id: id,
        });
    }
    // return { ...currentConfig, count: currentConfig.count + 1 };
  }

  console.log(configurations);

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
          <>
            <TableRow
              key={config.id}
            >
              <TableCell 
              onClick={() => toggleRowExpanded(config.id)}
              >
                <Checkbox
                  checked={true}
                  onCheckedChange={() => toggleConfig(config.id)}
                />
              </TableCell>
              <TableCell 
              onClick={() => toggleRowExpanded(config.id)}
              >
                <span className="cursor-pointer">
                  {expandedRows[config.id] ? (
                    <ChevronDown className="h-4 w-4 inline mr-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4 inline mr-4" />
                  )}
                  {config.name}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateCount(config.id, "decrement")}
                    // disabled={config.count === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{config.count}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateCount(config.id, "add")}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            {expandedRows[config.id] && (
              <TableRow>
                <TableCell colSpan={4}>
                  {config.components.map((comp) => (
                    <li key={comp.id}>{comp.name}</li>
                  ))}
                </TableCell>
              </TableRow>
            )}
          </>
        ))}
        <TableRow>
          <TableCell colSpan={2} className="font-medium text-start">
            Total: {totalAmount.toLocaleString()}
          </TableCell>
          <TableCell colSpan={2} className="text-right font-medium"></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default MyTable2;
