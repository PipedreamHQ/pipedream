import geogridapi from "../../geogridapi.app.mjs";
import { gridSummary } from "../../common/utils.mjs";

export default {
  key: "geogridapi-get-grid",
  name: "Get Grid",
  description: "Get the status and result of a grid: rank matrix (`ranks`, row 0 = north, `null` = not in the top 20), `summary`, rank and top 3 listings at each point (`points`), `competitors` ranking ahead and change since the previous grid of the same map (`previous`). Free."
    + " Use it to read a grid started by **Run Grid** with **Wait for Completion** off; use **List Grids** to find past grid IDs."
    + " [See the documentation](https://geogridapi.io/en/docs#grid)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    geogridapi,
    gridId: {
      propDefinition: [
        geogridapi,
        "gridId",
      ],
    },
  },
  async run({ $ }) {
    const grid = await this.geogridapi.getGrid({
      $,
      gridId: this.gridId,
    });
    $.export("$summary", gridSummary(grid));
    return grid;
  },
};
