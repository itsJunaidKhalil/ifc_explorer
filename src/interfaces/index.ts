type Element = "COLUMN" | "WALL" | "BEAM" | "FOUNDATION";

type Material = "STEEL" | "CONCRETE";

interface Connection {
  id: number,
  from: Element;
  fromMaterial: Material;
  to: Element;
  toMaterial: Material;
  amount: number;
}

const connections: Connection[] = [
  { id: 1, from: "COLUMN", fromMaterial: "STEEL", to: "WALL", toMaterial: "CONCRETE", amount: 10 },
  { id: 2, from: "COLUMN", fromMaterial: "STEEL", to: "BEAM", toMaterial: "CONCRETE", amount: 12 },
  { id: 3, from: "COLUMN", fromMaterial: "CONCRETE", to: "FOUNDATION", toMaterial: "STEEL", amount: 15 },
  { id: 4, from: "WALL", fromMaterial: "CONCRETE", to: "BEAM", toMaterial: "STEEL", amount: 7 },
  { id: 5, from: "WALL", fromMaterial: "STEEL", to: "FOUNDATION", toMaterial: "CONCRETE", amount: 8 },
  { id: 6, from: "BEAM", fromMaterial: "STEEL", to: "FOUNDATION", toMaterial: "CONCRETE", amount: 9 }
];

export interface Configuration {
  id: number
  name: string
  status: "Paid" | "Pending" | "Unpaid"
  count: number
  selected: boolean
}

export interface ConnComp {
  name: string
  components: Configuration[]
  connection: Connection
}

export type { Element, Material, Connection };
export { connections }