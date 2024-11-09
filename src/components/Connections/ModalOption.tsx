import { Checkbox } from "../ui/checkbox";
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

  return (
    <TableRow key={config.id} onClick={() => toggleConfig(config.id)}>
        <TableCell>
          <Checkbox
            checked={config.selected}
            onClick={event => event.preventDefault()}
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
