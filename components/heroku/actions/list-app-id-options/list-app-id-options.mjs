import heroku from "../../heroku.app.mjs";

export default {
  key: "heroku-list-app-id-options",
  name: "List App ID Options",
  description: "Retrieves available options for the App ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    heroku,
  },
  async run({ $ }) {
    const options = await heroku.propDefinitions.appId.options.call(this.heroku);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
