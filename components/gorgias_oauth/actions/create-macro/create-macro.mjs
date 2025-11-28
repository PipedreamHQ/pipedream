import gorgias_oauth from "../../gorgias_oauth.app.mjs";
import { parseObject } from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "gorgias_oauth-create-macro",
  name: "Create Macro",
  description: "Create a macro. [See the documentation](https://developers.gorgias.com/reference/create-macro)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gorgias_oauth,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the Macro. Tips: choose a name that can be easily searched.",
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
    const data = {
      name: this.name,
      intent: this.intent,
      language: this.language,
      actions: parseObject(this.actions),
    };
    const response = await this.gorgias_oauth.createMacro({
      $,
      data,
    });
    $.export("$summary", `Successfully created macro ${response.id}`);
    return response;
  },
};
