import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-get-macro",
  name: "Get Macro",
  description: "Retrieves a macro by its ID. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/business-rules/macros/#show-macro).",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zendesk,
    macroId: {
      propDefinition: [
        zendesk,
        "macroId",
      ],
    },
  },
  async run({ $ }) {
    const macro = await this.zendesk.getMacro({
      $,
      macroId: this.macroId,
    });

    $.export("$summary", `Successfully retrieved macro with ID ${this.macroId}`);
    return macro;
  },
};
