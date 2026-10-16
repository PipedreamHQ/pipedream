import getbody from "../../getbody.app.mjs";

export default {
  key: "getbody-suggest-price",
  name: "Suggest Price",
  description: "Suggest hourly, daily, weekly and monthly asking rates in USD for a robot you're about to list on GetBody, based on similar listings or on what the robot is worth. Prices are display only: nothing is charged through GetBody. [See the documentation](https://getbody.md/llms.txt)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    getbody,
    interfaceMode: {
      propDefinition: [
        getbody,
        "interfaceMode",
      ],
    },
    robotType: {
      propDefinition: [
        getbody,
        "robotType",
      ],
    },
    declaredValue: {
      type: "string",
      label: "Declared Value (USD)",
      description: "What the robot is worth in US dollars, e.g. `5000`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.getbody.suggestPrice({
      $,
      params: {
        interface_mode: this.interfaceMode,
        robot_type: this.robotType,
        declared_value: this.declaredValue,
      },
    });
    const rates = Object.entries(response.pricing || {})
      .filter(([
        key,
      ]) => key.startsWith("per_"))
      .map(([
        key,
        value,
      ]) => `$${value}/${key.slice(4)}`);
    $.export("$summary", `Successfully suggested ${rates.join(", ") || "no rates"}`);
    return response;
  },
};
