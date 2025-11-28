import gorgias_oauth from "../../gorgias_oauth.app.mjs";

export default {
  key: "gorgias_oauth-delete-macro",
  name: "Delete Macro",
  description: "Delete a macro. [See the documentation](https://developers.gorgias.com/reference/delete-macro)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gorgias_oauth,
    macroId: {
      propDefinition: [
        gorgias_oauth,
        "macroId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.gorgias_oauth.deleteMacro({
      $,
      id: this.macroId,
    });
    $.export("$summary", `Successfully deleted macro ${this.macroId}`);
    return response;
  },
};
