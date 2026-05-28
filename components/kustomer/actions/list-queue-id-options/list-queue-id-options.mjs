import kustomer from "../../kustomer.app.mjs";

export default {
  key: "kustomer-list-queue-id-options",
  name: "List Queue Id Options",
  description: "Retrieves available options for the Queue Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    kustomer,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await kustomer.propDefinitions.queueId.options.call(this.kustomer, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
