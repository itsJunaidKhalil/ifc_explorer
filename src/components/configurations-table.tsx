"use client";

import * as React from "react";
import { ChevronRight, ChevronDown, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConnComp } from "@/interfaces";
import { AppAction } from "@/App";


type Props = {
  configurations: ConnComp[];
  appDispatch: React.Dispatch<AppAction>;
};

export default function ConfigurationsTable({
  configurations,
  appDispatch,
}: Props) {
  const [expandedRows, setExpandedRows] = React.useState<
    Record<number, boolean>
  >({});

  const toggleRowExpanded = (rowId: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-center">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {configurations.map((row) => (
            <React.Fragment key={row.id}>
              <TableRow>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => toggleRowExpanded(row.id)}
                    aria-label={
                      expandedRows[row.id] ? "Collapse row" : "Expand row"
                    }
                  >
                    {expandedRows[row.id] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="flex items-center justify-center space-x-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      appDispatch({
                        type: "decrement_configuration",
                        id: row.id,
                      });
                    }}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{row.count}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      appDispatch({
                        type: "increment_configuration",
                        id: row.id,
                      });
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              {expandedRows[row.id] && (
                <TableRow>
                  <TableCell colSpan={4}>
                    {row.components.map((comp) => (
                      <li key={comp.id}>{comp.name}</li>
                    ))}
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
