import {
    AlertDialog as Dialog,
    AlertDialogContent as DialogContent,
    AlertDialogFooter as DialogFooter,
    AlertDialogHeader as DialogHeader,
    AlertDialogTitle as DialogTitle,
    AlertDialogDescription as DialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import React, { act, useReducer, useState } from "react";
// import MyTable2 from "../tables/MyTable2";
import { Configuration, Connection } from "@/interfaces";
import ModalOptions from "./ModalOptions";
import { AppAction } from "@/App";


const configurations: Configuration[] = [
    {
        id: 1,
        name: "Wall Shoe",
        status: "Paid",
        count: 0,
        selected: false,
    },
    {
        id: 2,
        name: "Cable Loop",
        status: "Pending",
        count: 0,
        selected: false,
    },
    {
        id: 3,
        name: "Connecting Rail",
        status: "Unpaid",
        count: 0,
        selected: false,
    },
    {
        id: 4,
        name: "Guardrail Pipe",
        status: "Paid",
        count: 0,
        selected: false,
    },
    {
        id: 5,
        name: "Dowel Plate",
        status: "Paid",
        count: 0,
        selected: false,
    },
    {
        id: 6,
        name: "Cuttings",
        status: "Paid",
        count: 0,
        selected: false,
    },
];

export type ModalAction = {
    type: "change_value",
    id: number,
    new_count: number,
} | {
    type: "toggle_select",
    id: number,
} | { type: 'ADD_CONFIGURATION'; payload: Configuration }
    | { type: 'REMOVE_CONFIGURATION'; payload: number }
    | { type: 'RESET' }



function ModalReducer(state: Configuration[], action: ModalAction): Configuration[] {
    switch (action.type) {
        case 'ADD_CONFIGURATION':
            return [...state, action.payload];
        case 'REMOVE_CONFIGURATION':
            return state.filter(config => config.id !== action.payload);
        case 'RESET':
            return [];
        case 'change_value':
            const newChangeState = state.map((conf) => {
                if (conf.id != action.id) return conf
                else if (conf.id == action.id) return { ...conf, count: action.new_count }
            })
            if (newChangeState.length == 0) return []

            return newChangeState as Configuration[]
        case 'toggle_select':
            const newSelectState = state.map((conf) => {
                if (conf.id != action.id) return conf
                else if (conf.id == action.id) return { ...conf, selected: !conf.selected }
            })
            if (newSelectState.length == 0) return []

            return newSelectState as Configuration[]
        default:
            return state;
    }
}

interface Props {
    con: Connection
    appDispatch?: React.Dispatch<AppAction>
}

export default function Modal({ con, appDispatch }: Props) {
    const { from, to, fromMaterial, toMaterial, amount } = con
    const [state, dispatch] = useReducer(ModalReducer, configurations)


    const [name, setName] = useState("")
    const [open, setOpen] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const [selectedConfigs, setSelectedConfigs] = useState<Configuration[]>();
    return (
        <div className="flex flex-col items-start gap-4">
            <Button onClick={() => setOpen(true)}>Select</Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>New Configuration</DialogTitle>
                        <DialogDescription >
                            {from} to {to}
                        </DialogDescription>
                        <DialogDescription >
                            ({fromMaterial}) to ({toMaterial})
                        </DialogDescription>
                        <input className=" bg-rose-400 border-solid border-black onBlur:"
                            value={name}
                            onInput={(e) => {
                                // gonna do something quick and dirty here
                                const { value } = e.target as unknown as { value: string }
                                setName(value)
                            }} placeholder="Do we ask for name?"></input>
                    </DialogHeader>
                    <div className="overflow-y-auto max-h-[60vh]">
                        <ModalOptions configurations={state} confDispatch={dispatch} />
                    </div>
                    <DialogFooter className="sm:justify-start gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                const out = state.filter((val) => val.selected && val.count !== 0
                                )

                                if (out.length > 0 && appDispatch) {
                                    // LOGIC HERE FOR RETURNING SELECTED COMPONENTS FOR CONFIGURATION
                                    appDispatch({
                                        type: "add_components",
                                        conn_comp: {
                                            name: name,
                                            components: [...out],
                                            connection: { ...con }
                                        }
                                    })

                                    console.log(out)
                                }
                                setOpen(false);
                            }}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
