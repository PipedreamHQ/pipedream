import dreamstudio from "../../dreamstudio.app.mjs";

export default {
  key: "dreamstudio-list-organization-id-options",
  name: "List Organization Id Options",
  description: "Retrieves available options for the Organization Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dreamstudio,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await dreamstudio.propDefinitions.organizationId.options
      .call(this.dreamstudio, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
