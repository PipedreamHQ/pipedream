import { jobber } from "../../jobber.app.mjs";

export default {
  key: "jobber-list-client-id-options",
  name: "List Client ID Options",
  description: "Retrieves available options for the Client ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    jobber,
  },
  async run({ $ }) {
    const options = await jobber.propDefinitions.clientId.options.call(this.jobber, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
