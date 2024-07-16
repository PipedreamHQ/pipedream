import peach from "../../peach.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "peach-send-template-message",
  name: "Send Template Message",
  description: "Send a predefined message to a contact within the Peach app. [See the documentation](https://peach.apidocumentation.com/reference)",
  version: "0.0.{{ts}}",
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
      propDefinition: [
        peach,
        "templateName",
      ],
      optional: true,
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
      propDefinition: [
        peach,
        "arguments",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.peach.sendTransactionalMessage({
      phoneNumber: this.phoneNumber,
      templateName: this.templateName,
      contactName: this.contactName,
      contactEmail: this.contactEmail,
      arguments: this.arguments,
    });

    $.export("$summary", `Message sent successfully to ${this.phoneNumber}`);
    return response;
  },
};
