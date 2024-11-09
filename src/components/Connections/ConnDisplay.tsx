import { AppAction } from "@/App";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { Connection } from "../../interfaces";
import { Badge } from "../ui/badge";
import Modal from "./Modal";

type Props = {
  conn: Connection;
  appDispatch: React.Dispatch<AppAction>;
};

export default function ConnDisplay({ conn, appDispatch }: Props) {
  const { from, to, fromMaterial, toMaterial, amount } = conn;

  if (!(from || to || fromMaterial || toMaterial || amount)) {
    return (
      <Card
        style={{
          padding: 15,
          margin: 20,
        }}
      ></Card>
    );
  }

  // const handleConfigureClick = () => {
  //     // ANYTHING THAT THE CONFIGURE SHOULD RUN OR REVEAL...
  //     console.log("CONFIGURE")
  //     props
  // }

  function cap(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  return (
    <Card className="w-full max-w-sm flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex justify-between w-full">
          <div>
            {cap(from)} to {cap(to)}
          </div>
          <div>
            {!conn.visible && (
              <EyeOff
                className="ml-2"
                onClick={() =>
                  appDispatch({
                    type: "toggle_visible_connection",
                    key: conn.key,
                  })
                }
              ></EyeOff>
            )}
            {conn.visible && (
              <Eye
                className="ml-2"
                onClick={() =>
                  appDispatch({
                    type: "toggle_visible_connection",
                    key: conn.key,
                  })
                }
              ></Eye>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="grow">
        <Badge variant="secondary" className="text-xs">
          {cap(fromMaterial)} to {cap(toMaterial)}
        </Badge>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2">
        <div className="text-sm font-medium text-center">Amount: {amount}</div>
        <Modal con={conn} appDispatch={appDispatch} />
      </CardFooter>
    </Card>
  );
}

// function getMissingFields(props: Connection) {
//   const missingFields = [];
//   const { from, to, fromMaterial, toMaterial, amount } = props;

//   if (!from) missingFields.push("from");
//   if (!to) missingFields.push("to");
//   if (!fromMaterial) missingFields.push("fromMaterial");
//   if (!toMaterial) missingFields.push("toMaterial");
//   if (!amount) missingFields.push("amount");

//   return missingFields.length > 0
//     ? `Missing fields: ${missingFields.join(", ")}`
//     : "All fields are present";
// }
