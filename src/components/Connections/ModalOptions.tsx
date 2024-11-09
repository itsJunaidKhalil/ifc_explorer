import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ModalAction } from "./Modal";
// import { useState } from "react";
import ModalOption from "./ModalOption";
import { Configuration } from "@/interfaces";
import { Card } from "../ui/card";

interface Props {
  configurations: Configuration[];
  confDispatch: React.Dispatch<ModalAction>;
}
const ModalOptions = ({ configurations, confDispatch }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [checked, setChecked] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const totalAmount = configurations.filter((val) => val.selected).length;
  return (
    <Card>
      <Table>
        <TableBody>
          {configurations.map((config, i) => (
            <ModalOption key={i} config={config} confDispatch={confDispatch} />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ModalOptions;
