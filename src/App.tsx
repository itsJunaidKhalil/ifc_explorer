import { Card } from "@/components/ui/card";
import "./App.css";
import ConnDisplay from "./components/Connections/ConnDisplay";
import { Configuration, ConnComp, Connection, connections } from "./interfaces";
import { useReducer, useState } from "react";
import Ifc from "./components/ifc";
import ConfigurationsTable from "./components/configurations-table";
import ExportDialog from "./components/alerts/ExportDialog";
import trollWebp from "./assets/troll_1f9cc.webp";

type AppState = {
  unique_id_count: number;
  configurations: ConnComp[];
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
  | {
      type: "increment_configuration";
      id: number;
    }
  | {
      type: "decrement_configuration";
      id: number;
    }
  | {
      type: "set_connection_amounts";
      connection_amounts: {
        key: string;
        amount: number;
      }[];
    }
  | {
      type: "toggle_visible_connection";
      key: string;
    }
  | { type: "ADD_CONFIGURATION"; payload: Configuration }
  | { type: "RESET_COMPONENTS" }
  | { type: "RESET" };

const AppReducer = (state: AppState, action: AppAction): AppState => {
  const connection1 = state.connections.find(
    (conn) =>
      state.configurations.find((val) => 'id' in action && val.id === action.id)?.connection
        .id === conn.id
  )!;
  // let count = 0;

  const connection2 = state.connections.find(
    (conn) =>
      state.configurations.find((val) => "id" in action && val.id === action.id)
        ?.connection.id === conn.id
  )!;
  switch (action.type) {
    // case 'ADD_CONFIGURATION':
    // return [...state, action.payload];
    // case 'REMOVE_CONFIGURATION':
    // return state.filter(config => config.id !== action.payload);
    case "RESET":
      return {
        unique_id_count: 0,
        configurations: [],
        connections: [],
      };
    case "RESET_COMPONENTS":
      return {
        ...state,
        configurations: [],
      };
    case "set_connection_amounts":
      return {
        ...state,
        connections: state.connections.map((conn) => {
          const count =
            action.connection_amounts.find((val) => val.key === conn.key)
              ?.amount ?? 0;
          return { ...conn, amount: count };
        }),
        configurations: [],
      };
    case "toggle_visible_connection":
      return {
        ...state,
        connections: state.connections.map((conn) => {
          if (conn.key === action.key) {
            return { ...conn, visible: !conn.visible };
          }
          return conn;
        }),
      };
    case "add_components":
      return {
        ...state,
        configurations: [
          ...state.configurations,
          { ...action.conn_comp, id: state.unique_id_count },
        ],
        unique_id_count: state.unique_id_count + 1,
        connections: state.connections.map((con) => {
          if (con.id == action.conn_comp.connection.id)
            return { ...con, amount: con.amount - 1 };
          return con;
        }),
      };
    case "increment_configuration":
      return {
        ...state,
        configurations: state.configurations.map((val) => {
          if (val.id === action.id) {
            if (connection1.amount === 0) return val;
            return { ...val, count: val.count + 1 };
          }
          return val;
        }),
        connections: state.connections.map((con) => {
          if (con.id == connection1.id && con.amount > 0)
            return { ...con, amount: con.amount - 1 };
          return con;
        }),
      };
    case "decrement_configuration":
      return {
        ...state,
        configurations: state.configurations
          .filter((val) => !(val.id === action.id && val.count === 1))
          .map((val) => {
            if (val.id === action.id) {
              return { ...val, count: val.count - 1 };
            }
            return val;
          }),
        connections: state.connections.map((con) => {
          if (con.id == connection2.id)
            return { ...con, amount: con.amount + 1 };
          return con;
        }),
      };
    case "remove_component":
      return {
        ...state,
        configurations: state.configurations.filter(
          (val) => val.id !== action.id
        ),
        connections: state.connections.map((con) => {
          const conn_comp = state.configurations.filter(
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
    configurations: [],
    connections: connections,
  });
  const [loading, setLoading] = useState(false);

  console.log(state);
  console.log("-------------");
  console.log(state.configurations);
  return (
    <div>
      {loading && (
        <div className="overlay fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <span className="font-semibold text-lg">
            Building the 3d Model, please wait...
          </span>
        </div>
      )}
      <div className="min-h-screen flex flex-col">
        <header className="bg-background border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-4">
            <h1 className="text-2xl font-bold">
              IFCTroll
              <img src={trollWebp} className="inline h-6 w-6 ms-2" />
            </h1>
            {/* 🧌 */}
            <ExportDialog
              connection_comps={state.configurations}
              appDispatch={dispatch}
            />
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <Card className="h-full">
                <Ifc
                  setLoading={setLoading}
                  appDispatch={dispatch}
                  connections={state.connections}
                />
              </Card>
              {/* <Button onClick={() => setIsTransparent(!isTransparent)}>{isTransparent ? 'Transparent' : 'See transparent'}</Button> */}
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Connections</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {state.connections.map(
                  (val) =>
                    val.amount > 0 && (
                      <ConnDisplay
                        conn={val}
                        key={val.key}
                        appDispatch={dispatch}
                      />
                    )
                )}
              </div>
              {state.configurations.length > 0 && (
                <>
                  <h2 className="text-xl font-semibold mb-4 mt-4">
                    Configurations
                  </h2>
                  <Card>
                    <ConfigurationsTable
                      configurations={state.configurations}
                      appDispatch={dispatch}
                    />
                  </Card>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
