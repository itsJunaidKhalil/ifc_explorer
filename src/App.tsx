import { Card } from "@/components/ui/card";
import "./App.css";
import MyAlert2 from "./components/alerts/MyAlert2";
import ConnDisplay from "./components/Connections/ConnDisplay";
import { Configuration, ConnComp, Connection, connections } from "./interfaces";
import { useReducer, useState } from "react";
import Ifc from "./components/ifc";
import MyTable2 from "./components/tables/MyTable2";
import ExpandableTableLeft from "./components/configurations-table";
import { Button } from "./components/ui/button";

type AppState = {
  unique_id_count: number;
  connection_components: ({ id: number } & ConnComp)[];
  connections: Connection[];
};

export type AppAction =
  | {
      type: "add_components";
      conn_comp: ConnComp;
    }
  | {
      type: "remove_component";
      id: number;
    }
  | { type: "ADD_CONFIGURATION"; payload: Configuration }
  | { type: "RESET_COMPONENTS" }
  | { type: "RESET" };

const AppReducer = (state: AppState, action: AppAction): AppState => {
  let count = 0;
  switch (action.type) {
    // case 'ADD_CONFIGURATION':
    // return [...state, action.payload];
    // case 'REMOVE_CONFIGURATION':
    // return state.filter(config => config.id !== action.payload);
    case "RESET":
      return {
        unique_id_count: 0,
        connection_components: [],
        connections: [],
      };
    case "RESET_COMPONENTS":
      return {
        ...state,
        connection_components: [],
      };
    case "add_components":
      return {
        ...state,
        connection_components: [
          ...state.connection_components,
          { id: state.unique_id_count, ...action.conn_comp },
        ],
        unique_id_count: state.unique_id_count + 1,
        connections: state.connections.map((con) => {
          if (con.id == action.conn_comp.connection.id)
            return { ...con, amount: con.amount - 1 };
          return con;
        }),
      };
    case "remove_component":
      return {
        ...state,
        connection_components: state.connection_components.filter(
          (val) => val.id !== action.id
        ),
        connections: state.connections.map((con) => {
          const conn_comp = state.connection_components.filter(
            (val) => val.id === action.id
          );
          if (conn_comp.length == 1 && con.id == conn_comp[0].connection.id)
            return { ...con, amount: con.amount + 1 };
          return con;
        }),
      };

    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(AppReducer, {
    unique_id_count: 0,
    connection_components: [],
    connections: connections,
  });
  const [isTransparent, setIsTransparent] = useState(false);

  console.log(state);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">IFCTroll 🧌</h1>
          <MyAlert2
            connection_comps={state.connection_components}
            appDispatch={dispatch}
          />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <Card className="h-full">
              <Ifc isTransparent={isTransparent}/>
            </Card>
            <Button onClick={() => setIsTransparent(!isTransparent)}>{isTransparent ? 'Transparent' : 'Set transparent'}</Button>
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Connections</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {state.connections.map((val, i) => (
                <ConnDisplay key={i} {...val} appDispatch={dispatch} />
              ))}
            </div>
            <h2 className="text-xl font-semibold mb-4 mt-4">Configurations</h2>
            <Card>
              <ExpandableTableLeft />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
