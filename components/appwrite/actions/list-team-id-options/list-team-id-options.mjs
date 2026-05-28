import { appwrite } from "../../appwrite.app.mjs";

export default {
  key: "appwrite-list-team-id-options",
  name: "List Team ID Options",
  description: "Retrieves available options for the Team ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    appwrite,
  },
  async run({ $ }) {
    const options = await appwrite.propDefinitions.teamId.options.call(this.appwrite, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
