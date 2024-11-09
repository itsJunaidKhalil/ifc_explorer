type Element = "COLUMN" | "WALL" | "BEAM" | "FOUNDATION";

type Material = "STEEL" | "CONCRETE";

interface Connection {
  id: number;
  from: Element;
  fromMaterial: Material;
  to: Element;
  toMaterial: Material;
  amount: number;
  key: string;
  visible: boolean;
  color: string;
}

const connections: Connection[] = [
  {
    id: 1,
    from: "COLUMN",
    fromMaterial: "STEEL",
    to: "BEAM",
    toMaterial: "CONCRETE",
    amount: 0,
    key: "COLUMN_BEAM",
    visible: true,
    color: "#00bfff",
  },
  {
    id: 2,
    from: "COLUMN",
    fromMaterial: "CONCRETE",
    to: "FOUNDATION",
    toMaterial: "STEEL",
    amount: 0,
    key: "COLUMN_FOOTING",
    visible: true,
    color: "#8a2be2",
  },
  {
    id: 3,
    from: "BEAM",
    fromMaterial: "STEEL",
    to: "FOUNDATION",
    toMaterial: "CONCRETE",
    amount: 0,
    key: "BEAM_FOOTING",
    visible: true,
    color: "#005205",
  },
  {
    id: 4,
    from: "COLUMN",
    fromMaterial: "STEEL",
    to: "COLUMN",
    toMaterial: "CONCRETE",
    amount: 0,
    key: "COLUMN_COLUMN",
    visible: true,
    color: "#ff33a8",
  },
  {
    id: 5,
    from: "FOUNDATION",
    fromMaterial: "CONCRETE",
    to: "FOUNDATION",
    toMaterial: "CONCRETE",
    amount: 0,
    key: "FOOTING_FOOTING",
    visible: true,
    color: "#ffd133",
  },
  {
    id: 6,
    from: "BEAM",
    fromMaterial: "CONCRETE",
    to: "BEAM",
    toMaterial: "CONCRETE",
    amount: 0,
    key: "BEAM_BEAM",
    visible: true,
    color: "#ff5733",
  },
];

export interface Configuration {
  id: number;
  name: string;
  status: "Paid" | "Pending" | "Unpaid";
  count: number;
  selected: boolean;
}

export interface ConnComp {
  id: number;
  name: string;
  count: number;
  components: Configuration[];
  connection: Connection;
}

export type { Element, Material, Connection };
export { connections };
