"use client";

import * as React from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TableData = {
  id: number;
  type: string;
  name: string;
  amount: number;
};

const data: TableData[] = [
  { id: 1, type: "Column to Wall", name: "1", amount: 2 },
  { id: 2, type: "Column to Wall", name: "2", amount: 3 },
];

export default function ExpandableTableLeft() {
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
            <TableHead>Type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
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
                <TableCell className="font-medium">{row.type}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell className="text-right">{row.amount}</TableCell>
              </TableRow>
              {expandedRows[row.id] && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="p-2 bg-muted">
                      <pre className="text-sm whitespace-pre-wrap">
                        {JSON.stringify(row, null, 2)}
                      </pre>
                    </div>
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
