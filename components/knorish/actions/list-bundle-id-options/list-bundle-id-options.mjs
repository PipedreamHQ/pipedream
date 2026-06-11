import knorish from "../../knorish.app.mjs";

export default {
  key: "knorish-list-bundle-id-options",
  name: "List Bundle Id Options",
  description: "Retrieves available options for the Bundle Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    knorish,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await knorish.propDefinitions.bundleId.options.call(this.knorish, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
