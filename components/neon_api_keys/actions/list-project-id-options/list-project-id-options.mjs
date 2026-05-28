import { neon_api_keys } from "../../neon_api_keys.app.mjs";

export default {
  key: "neon_api_keys-list-project-id-options",
  name: "List Project ID Options",
  description: "Retrieves available options for the Project ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    neon_api_keys,
  },
  async run({ $ }) {
    const options = await neon_api_keys.propDefinitions.projectId.options
      .call(this.neon_api_keys, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
