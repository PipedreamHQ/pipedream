import { ConfigurationError } from "@pipedream/platform";
import boloforms from "../../boloforms.app.mjs";

export default {
  key: "boloforms-send-form",
  name: "Send Form",
  description: "Enables form dispatching to a specific recipient. [See the documentation](https://help.boloforms.com/en/articles/8557660-sending-for-signing)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    boloforms,
    formId: {
      propDefinition: [
        boloforms,
        "formId",
      ],
      type: "string",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the receiver.",
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
  },
  async run({ $ }) {
    const response = await this.boloforms.dispatchForm({
      $,
      data: {
        formId: this.formId,
        email: {
          to: this.email,
          subject: this.subject,
          message: this.message,
        },
      },
    });

    if (response.error) {
      throw new ConfigurationError(response.error);
    }

    $.export("$summary", `Form dispatched successfully to ${this.email}`);
    return response;
  },
};
