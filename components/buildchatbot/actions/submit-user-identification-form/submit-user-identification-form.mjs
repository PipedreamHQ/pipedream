import buildchatbot from "../../buildchatbot.app.mjs";

export default {
  key: "buildchatbot-submit-user-identification-form",
  name: "Submit User Identification Form",
  description: "Submit a user identification form. [See the API documentation](https://documenter.getpostman.com/view/27680478/2s9YR6baAb#d1454ee4-53c5-4553-823e-85c0ff1745c6)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    buildchatbot,
    chatbotId: {
      propDefinition: [
        buildchatbot,
        "chatbotId",
      ],
      description: "The ID of the chatbot to send the message to",
    },
    businnessName: {
      type: "string",
      label: "Business Name",
      description: "The business name to submit the form for",
      optional: true,
    },
    contactName: {
      type: "string",
      label: "Contact Name",
      description: "The contact name to submit the form for",
      optional: true,
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "The email address to submit the form for",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number to submit the form for",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.buildchatbot.submitUserIdentificationForm({
      $,
      chatbotId: this.chatbotId,
      data: {
        businness_name: this.businnessName,
        contact_name: this.contactName,
        email_address: this.emailAddress,
        phone_no: this.phoneNumber,
      },
    });

    $.export("$summary", `Successfully submitted user identification form with ID ${response.data.identication_id}`);
    return response;
  },
};
