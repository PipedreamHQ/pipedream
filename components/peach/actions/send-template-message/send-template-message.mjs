import { clearObj } from "../../common/utils.mjs";
import peach from "../../peach.app.mjs";

export default {
  key: "peach-send-template-message",
  name: "Send Template Message",
  description: "Send a predefined message to a contact within the Peach app. [See the documentation](https://peach.apidocumentation.com/reference#tag/messaging/post/transactional_messages)",
  version: "0.0.1",
  type: "action",
  props: {
    peach,
    phoneNumber: {
      propDefinition: [
        peach,
        "phoneNumber",
      ],
    },
    templateName: {
      type: "string",
      label: "Template Name",
      description: "WhatsApp approved utility template name",
    },
    contactName: {
      propDefinition: [
        peach,
        "contactName",
      ],
      optional: true,
    },
    contactEmail: {
      propDefinition: [
        peach,
        "contactEmail",
      ],
      optional: true,
    },
    arguments: {
      type: "object",
      label: "Arguments",
      description: "Arguments for the template",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.peach.sendTransactionalMessage({
      $,
      data: clearObj({
        template_name: this.templateName,
        to: {
          name: this.contactName,
          email: this.contactEmail,
          phone_number: this.phoneNumber,
        },
        arguments: this.arguments
          ? Object.keys(this.arguments).map((key) => ({
            key,
            value: this.arguments[key],
          }))
          : {},
      }),
    });

    $.export("$summary", `Message sent successfully to ${this.phoneNumber}`);
    return response;
  },
};
