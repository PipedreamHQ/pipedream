import accredible from "../../accredible.app.mjs";

export default {
  key: "accredible-list-credential-id-options",
  name: "List Credential ID Options",
  description: "Retrieves available options for the Credential ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    accredible,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await accredible.propDefinitions.credentialId.options
      .call(this.accredible, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
