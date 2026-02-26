import { ConfigurationError } from "@pipedream/platform";
import boloforms from "../../boloforms.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "boloforms-send-template-signature",
  name: "Send Template Signature",
  description: "Dispatch a predefined template to obtain a signature. [See the documentation](https://help.boloforms.com/en/articles/8557564-sending-for-signing)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    boloforms,
    documentId: {
      propDefinition: [
        boloforms,
        "documentId",
        () => ({
          isStandAloneTemplate: true,
        }),
      ],
      type: "string",
    },
    subject: {
      propDefinition: [
        boloforms,
        "subject",
      ],
    },
    message: {
      propDefinition: [
        boloforms,
        "message",
      ],
    },
    receiversList: {
      type: "string[]",
      label: "Receivers List",
      description: "A list of receiver objects. **Format: {\"name\": \"Chirag Gupta\", \"email\": \"support@boloforms.com\", \"roleTitle\": \"Junior Doctor\", \"roleColour\": \"#8FB1C8\"}** `roleTitle` has to be exactly the same as the role you added or it won't work properly. You can pass a hex code to give a color to your role, but it's not required.",
    },
    customVariables: {
      type: "string[]",
      label: "Custom Variables",
      description: "A list of custom variable objects. **Format: {\"varName\": \"[v1]\", \"varValue\": \"v1 value from api\" }**. The variable name has to be in square brackets. If you don't pass customVariables then the call will still work, Boloforms will pass each variable as empty.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.boloforms.dispatchPDFTemplate({
      $,
      data: {
        documentId: this.documentId,
        mailData: {
          subject: this.subject,
          message: this.message,
        },
        receiversList: parseObject(this.receiversList),
        customVariables: parseObject(this.customVariables),
      },
    });

    if (response.error) {
      throw new ConfigurationError(response.error);
    }

    $.export("$summary", `Template dispatched successfully to ${parseObject(this.receiversList).length} receivers`);
    return response;
  },
};
