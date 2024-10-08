import the_magic_drip from "../../the_magic_drip.app.mjs";

export default {
  key: "the_magic_drip-list-templates",
  name: "List Templates",
  description: "Lists all available templates. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    the_magic_drip,
  },
  async run({ $ }) {
    const templates = await this.the_magic_drip.listTemplates();
    $.export("$summary", `Listed ${templates.templates.length} templates`);
    return templates;
  },
};
