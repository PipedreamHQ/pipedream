import { redmine } from "../../redmine.app.mjs";

export default {
  key: "redmine-list-user-id-options",
  name: "List User ID Options",
  description: "Retrieves available options for the User ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    redmine,
  },
  async run({ $ }) {
    const options = await redmine.propDefinitions.userId.options.call(this.redmine, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
