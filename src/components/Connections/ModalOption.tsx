import { Checkbox } from "../ui/checkbox";
import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { TableRow, TableCell } from "../ui/table";
import { ModalAction } from "./Modal";
import { Configuration } from "@/interfaces";

interface Props {
  config: Configuration;
  confDispatch: React.Dispatch<ModalAction>;
}

export default function ModalOption(props: Props) {
  const { config, confDispatch } = props;

  function toggleConfig(id: number) {
    confDispatch({
      type: "toggle_select",
      id: id,
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function updateCount(id: number, v: boolean) {
    confDispatch({
      type: "change_value",
      id: id,
      new_count: v ? config.count + 1 : config.count - 1,
    });
  }

  return (
    <TableRow key={config.id}>
      <TableCell>
        <Checkbox
          checked={config.selected}
          onCheckedChange={() => toggleConfig(config.id)}
        />
      </TableCell>
      <TableCell>{config.name}</TableCell>
      <TableCell className="text-right">
        <div className=""></div>
      </TableCell>
    </TableRow>
  );
}
