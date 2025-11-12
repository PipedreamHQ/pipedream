import app from "../../documint.app.mjs";

export default {
  name: "List Templates",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "documint-list-templates",
  description: "Retrieves a list of your available Documint templates. [See the documentation](https://documenter.getpostman.com/view/11741160/TVK5cLxQ#0c2d2c5b-505c-4d70-bb95-767369a0bcc9)",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const { data: templates } = await this.app.getTemplates({
      $,
    });

    if (templates?.length) {
      $.export("$summary", `Successfully retrieved ${templates.length} template${templates.length === 1
        ? ""
        : "s"}.`);
    }

    return templates;
  },
};
