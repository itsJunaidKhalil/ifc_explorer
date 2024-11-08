type Element = "COLUMN" | "WALL" | "BEAM" | "FOUDNATION";

type Material = "STEEL" | "CONCRETE";

interface Connection {
  from: Element;
  fromMaterial: Material;
  to: Element;
  toMaterial: Material;
  amount: number;
}

export { Element, Material, Connection };
