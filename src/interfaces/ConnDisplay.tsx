import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Connection, Element, Material } from ".";


export default function ConnDisplay(props: Connection) {
    const { from, to, fromMaterial, toMaterial, amount } = props
    const [checked, setChecked] = useState(false)

    if (!(from || to || fromMaterial || toMaterial || amount)) {
        return <Card style={{
            padding: 15,
            margin: 20
        }}>
            <h1>{getMissingFields(props)}</h1>
        </Card>
    }


    const handleConfigureClick = () => {
        // ANYTHING THAT THE CONFIGURE SHOULD RUN OR REVEAL...
        console.log("CONFIGURE")
        props
    }

    const handleCheckedChange = () => {
        setChecked(!checked)
    }

    return <Card style={{
        padding: 15,
        margin: 20
    }}>
        <div className=" flex justify-between">
            <h1 className="">{from}</h1>
            <h1 className="">To</h1>
            <h1>{to}</h1>

        </div>
        <div className=" flex justify-between">
            <h1 className="">{fromMaterial}</h1>

            <h1>{toMaterial}</h1>

        </div>

        <div className=" flex justify-between items-center">
            <p>
                {amount}
            </p>
            <div className="items-center">

                <Checkbox className=" mx-2 my-0" checked={checked} onCheckedChange={handleCheckedChange} />
                <Button onClick={handleConfigureClick} className="">Configure</Button>
            </div>
        </div>
    </Card>
}

function getMissingFields(props: Connection) {
    const missingFields = [];
    const { from, to, fromMaterial, toMaterial, amount } = props

    if (!from) missingFields.push("from");
    if (!to) missingFields.push("to");
    if (!fromMaterial) missingFields.push("fromMaterial");
    if (!toMaterial) missingFields.push("toMaterial");
    if (!amount) missingFields.push("amount");

    return missingFields.length > 0
        ? `Missing fields: ${missingFields.join(", ")}`
        : "All fields are present";
}
