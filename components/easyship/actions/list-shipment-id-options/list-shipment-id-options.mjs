import easyship from "../../easyship.app.mjs";

export default {
  key: "easyship-list-shipment-id-options",
  name: "List Shipment ID Options",
  description: "Retrieves available options for the Shipment ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    easyship,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await easyship.propDefinitions.shipmentId.options.call(this.easyship, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
