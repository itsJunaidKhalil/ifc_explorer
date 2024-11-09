import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { ModalAction } from "./Modal";
// import { useState } from "react";
import ModalOption from "./ModalOption";
import { Configuration } from "@/interfaces";

interface Props {
    configurations: Configuration[];
    confDispatch: React.Dispatch<ModalAction>;
}
const ModalOptions = ({ configurations, confDispatch }: Props) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const [checked, setChecked] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const totalAmount = configurations.filter((val) => val.selected).length
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Add</TableHead>
                    <TableHead>Component</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {configurations.map((config, i) => (
                    <ModalOption key={i} config={config} confDispatch={confDispatch} />
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

export default ModalOptions;
