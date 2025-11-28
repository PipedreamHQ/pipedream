import gorgias from "../../gorgias_oauth.app.mjs";

export default {
  key: "gorgias_oauth-get-macro",
  name: "Get Macro",
  description: "Get a macro by ID. [See the documentation](https://developers.gorgias.com/reference/get-macro)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gorgias,
    macroId: {
      propDefinition: [
        gorgias,
        "macroId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.gorgias.getMacro({
      $,
      id: this.macroId,
    });
    $.export("$summary", `Successfully retrieved macro with ID: ${this.macroId}`);
    return response;
  },
};
