import shipstation from "../../shipstation.app.mjs";

export default {
  key: "shipstation-list-store-id-options",
  name: "List Store Options",
  description: "Retrieves available options for the Store field. [See the documentation](https://docs.shipstation.com/apis/shipstation-v1/openapi/stores/list_stores)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    shipstation,
  },
  async run({ $ }) {
    const options = await shipstation.propDefinitions.storeId.options.call(this.shipstation);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
