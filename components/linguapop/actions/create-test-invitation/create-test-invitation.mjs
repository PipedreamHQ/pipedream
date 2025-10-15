import linguapop from "../../linguapop.app.mjs";

export default {
  key: "linguapop-create-test-invitation",
  name: "Create Test Invitation",
  description: "Creates a new placement test invitation. [See the documentation](https://docs.linguapop.eu/api/#sendcreate-an-invitation-to-a-placement-test)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    linguapop,
    email: {
      type: "string",
      label: "Email",
      description: "The candidate's email address. This can also be used to identify your candidate.",
    },
    sendEmail: {
      type: "boolean",
      label: "Send Email",
      description: "This determines whether Linguapop sends an invitation email to your candidate.",
    },
    languageCode: {
      propDefinition: [
        linguapop,
        "languageCode",
      ],
    },
    externalIdentifier: {
      type: "string",
      label: "External Identifier",
      description: "This is an ID you can generate from your CRM to uniquiely identify your candidate.",
      optional: true,
    },
    testReading: {
      type: "boolean",
      label: "Test Reading",
      description: "This determines whether the test will include a reading section. If not provided, the default option set in your [Customization](https://docs.linguapop.eu/customization/#additional-skills-tested) will be used.",
      optional: true,
    },
    testListening: {
      type: "boolean",
      label: "Test Listening",
      description: "This determines whether the test will include a listening section. If not provided, the default option set in your [Customization](https://docs.linguapop.eu/customization/#additional-skills-tested) will be used.",
      optional: true,
    },
    callbackUrl: {
      type: "string",
      label: "Callback URL",
      description: "This is the [callback URL](https://docs.linguapop.eu/api/#the-callback-url) to which a POST request will be sent with the results of the placement test once the test is completed.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.linguapop.createTestInvitation({
      $,
      data: {
        email: this.email,
        sendEmail: this.sendEmail,
        languageCode: this.languageCode,
        externalIdentifier: this.externalIdentifier,
        testReading: this.testReading,
        testListening: this.testListening,
        callbackUrl: this.callbackUrl,
      },
    });
    $.export("$summary", `Successfully created test invitation for ${this.email}`);
    return response;
  },
};
