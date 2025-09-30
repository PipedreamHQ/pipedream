import app from "../../the_magic_drip.app.mjs";

export default {
  key: "the_magic_drip-list-templates",
  name: "List Templates",
  description: "Retrieve all available templates. [See the documentation](https://docs.themagicdrip.com/api-reference/endpoint/get-v1templates)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const { templates } = await this.app.listTemplates({
      $,
    });
    $.export("$summary", `Sucessfully retrieved ${templates?.length ?? 0} templates`);
    return templates;
  },
};
