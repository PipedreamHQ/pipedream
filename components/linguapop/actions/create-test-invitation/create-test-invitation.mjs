import linguapop from "../../linguapop.app.mjs";

export default {
  key: "linguapop-create-test-invitation",
  name: "Create Test Invitation",
  description: "Creates a new placement test invitation.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    linguapop,
    recipientEmail: linguapop.propDefinitions.recipientEmail,
    invitationContent: {
      ...linguapop.propDefinitions.invitationContent,
      optional: true,
    },
    language: linguapop.propDefinitions.language,
  },
  async run({ $ }) {
    const response = await this.linguapop.createTestInvitation({
      language: this.language,
      recipientEmail: this.recipientEmail,
      invitationContent: this.invitationContent,
    });
    $.export("$summary", `Successfully created test invitation for ${this.recipientEmail}`);
    return response;
  },
};
