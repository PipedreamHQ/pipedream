import accuranker from "../../accuranker.app.mjs";

export default {
  key: "accuranker-list-domain-id-options",
  name: "List Domain ID Options",
  description: "Retrieves available options for the Domain ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    accuranker,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await accuranker.propDefinitions.domainId.options
      .call(this.accuranker, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
