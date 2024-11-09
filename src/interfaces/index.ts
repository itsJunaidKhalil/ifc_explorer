type Element = "COLUMN" | "WALL" | "BEAM" | "FOUNDATION";

type Material = "STEEL" | "CONCRETE";

interface Connection {
  from: Element;
  fromMaterial: Material;
  to: Element;
  toMaterial: Material;
  amount: number;
}

const connections: Connection[] = [
  { from: "COLUMN", fromMaterial: "STEEL", to: "WALL", toMaterial: "CONCRETE", amount: 10 },
  { from: "COLUMN", fromMaterial: "STEEL", to: "BEAM", toMaterial: "CONCRETE", amount: 12 },
  { from: "COLUMN", fromMaterial: "CONCRETE", to: "FOUNDATION", toMaterial: "STEEL", amount: 15 },
  { from: "WALL", fromMaterial: "CONCRETE", to: "BEAM", toMaterial: "STEEL", amount: 7 },
  { from: "WALL", fromMaterial: "STEEL", to: "FOUNDATION", toMaterial: "CONCRETE", amount: 8 },
  { from: "BEAM", fromMaterial: "STEEL", to: "FOUNDATION", toMaterial: "CONCRETE", amount: 9 }
];

export type { Element, Material, Connection };
export { connections }