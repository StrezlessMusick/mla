import RGBA from "@src/utilities/colours/rgba.class";
import type { d3Node } from "@src/web/reports/generics/types/charts/sunburst.types";

const nullNode = {
  data: { name: "", entity: "unknown" },
  colour: new RGBA("rgba(0,0,0,0)"),
  parent: { data: { name: "", entity: "unknown" } },
  value: 0,
} as d3Node;

export default nullNode;
