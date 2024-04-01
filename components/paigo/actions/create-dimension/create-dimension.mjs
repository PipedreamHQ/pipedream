import paigo from "../../paigo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "paigo-create-dimension",
  name: "Create Dimension",
  description: "Creates a new dimension inside the Paigo platform.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    paigo,
    dimensionDetails: {
      propDefinition: [
        paigo,
        "dimensionDetails",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.paigo.createDimension(this.dimensionDetails);
    $.export("$summary", `Successfully created dimension with ID: ${response.id}`);
    return response;
  },
};
