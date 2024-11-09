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
}

const connections: Connection[] = [
  {
    id: 1,
    from: "COLUMN",
    fromMaterial: "STEEL",
    to: "WALL",
    toMaterial: "CONCRETE",
    amount: 0,
    key: "COLUMN_WALL",
    visible: true,
  },
  {
    id: 2,
    from: "COLUMN",
    fromMaterial: "STEEL",
    to: "BEAM",
    toMaterial: "CONCRETE",
    amount: 0,
    key: "COLUMN_BEAM",
    visible: true,
  },
  {
    id: 3,
    from: "COLUMN",
    fromMaterial: "CONCRETE",
    to: "FOUNDATION",
    toMaterial: "STEEL",
    amount: 0,
    key: "COLUMN_FOOTING",
    visible: true,
  },
  {
    id: 4,
    from: "WALL",
    fromMaterial: "CONCRETE",
    to: "BEAM",
    toMaterial: "STEEL",
    amount: 0,
    key: "WALL_BEAM",
    visible: true,
  },
  {
    id: 5,
    from: "WALL",
    fromMaterial: "STEEL",
    to: "FOUNDATION",
    toMaterial: "CONCRETE",
    amount: 0,
    key: "WALL_FOUNDATION",
    visible: true,
  },
  {
    id: 6,
    from: "BEAM",
    fromMaterial: "STEEL",
    to: "FOUNDATION",
    toMaterial: "CONCRETE",
    amount: 0,
    key: "BEAM_FOOTING",
    visible: true,
  },
  {
    id: 7,
    from: "COLUMN",
    fromMaterial: "STEEL",
    to: "COLUMN",
    toMaterial: "CONCRETE",
    amount: 0,
    key: "COLUMN_COLUMN",
    visible: true,
  },
  {
    id: 8,
    from: "FOUNDATION",
    fromMaterial: "CONCRETE",
    to: "FOUNDATION",
    toMaterial: "CONCRETE",
    amount: 0,
    key: "FOOTING_FOOTING",
    visible: true,
  },
  {
    id: 8,
    from: "BEAM",
    fromMaterial: "CONCRETE",
    to: "BEAM",
    toMaterial: "CONCRETE",
    amount: 0,
    key: "BEAM_BEAM",
    visible: true,
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
