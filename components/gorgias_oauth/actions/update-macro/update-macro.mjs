import gorgias_oauth from "../../gorgias_oauth.app.mjs";
import constants from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "gorgias_oauth-update-macro",
  name: "Update Macro",
  description: "Update a macro. [See the documentation](https://developers.gorgias.com/reference/update-macro)",
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
    name: {
      type: "string",
      label: "Name",
      description: "The name of the Macro. Tips: choose a name that can be easily searched.",
      optional: true,
    },
    intent: {
      type: "string",
      label: "Intent",
      description: "The intention of the macro should be used for",
      optional: true,
      options: constants.macroIntents,
    },
    language: {
      propDefinition: [
        gorgias_oauth,
        "language",
      ],
      description: "The language of the macro",
    },
    actions: {
      type: "string[]",
      label: "Actions",
      description: `A list of actions to be applied on tickets. [See the documentation](https://developers.gorgias.com/reference/create-macro) for more info.
      \nExample: [{
        "arguments": {
          "tags": "question, order-status"
        },
        "name": "addTags",
        "title": "add tags",
        "type": "user"
      }]`,
      optional: true,
    },
  },
  async run({ $ }) {
    const macro = await this.gorgias_oauth.getMacro({
      $,
      id: this.macroId,
    });
    const data = {
      name: this.name || macro.name,
      intent: this.intent,
      language: this.language,
      actions: parseObject(this.actions),
    };
    const response = await this.gorgias_oauth.updateMacro({
      $,
      id: this.macroId,
      data,
    });
    $.export("$summary", `Successfully updated macro ${response.id}`);
    return response;
  },
};
