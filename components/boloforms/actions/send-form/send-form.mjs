import boloforms from "../../boloforms.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "boloforms-send-form",
  name: "Send Form",
  description: "Enables form dispatching to a specified recipient.",
  version: "0.0.${ts}",
  type: "action",
  props: {
    boloforms,
    recipientEmail: boloforms.propDefinitions.recipientEmail,
    customMessage: {
      ...boloforms.propDefinitions.customMessage,
      optional: true,
    },
    formId: boloforms.propDefinitions.formId,
  },
  async run({ $ }) {
    const response = await this.boloforms.dispatchForm({
      formId: this.formId,
      recipientEmail: this.recipientEmail,
      customMessage: this.customMessage,
    });
    $.export("$summary", `Form dispatched successfully to ${this.recipientEmail}`);
    return response;
  },
};
