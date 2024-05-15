import boloforms from "../../boloforms.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "boloforms-send-template-signature",
  name: "Send Template Signature",
  description: "Dispatch a predefined template to obtain a signature.",
  version: "0.0.${ts}",
  type: "action",
  props: {
    boloforms,
    templateId: {
      propDefinition: [
        boloforms,
        "templateId",
      ],
    },
    signerEmail: {
      propDefinition: [
        boloforms,
        "signerEmail",
      ],
    },
    variables: {
      type: "string[]",
      label: "Variables",
      description: "Variables to insert into the template.",
      optional: true,
    },
  },
  async run({ $ }) {
    const variablesParsed = this.variables
      ? this.variables.map((variable) => JSON.parse(variable))
      : undefined;
    const response = await this.boloforms.dispatchTemplate({
      templateId: this.templateId,
      signerEmail: this.signerEmail,
      variables: variablesParsed,
    });
    $.export("$summary", `Template dispatched successfully to ${this.signerEmail}`);
    return response;
  },
};
