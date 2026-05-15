import browserstack from "../../browserstack.app.mjs";

export default {
  key: "browserstack-list-browser-options",
  name: "List Browser Options",
  description: "Retrieves available options for the Browser field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    browserstack,
  },
  async run({ $ }) {
    const options = await browserstack.propDefinitions.browser.options.call(this.browserstack);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
