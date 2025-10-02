import stripo from "../../stripo.app.mjs";

export default {
  key: "stripo-remove-email",
  name: "Remove Email",
  description: "Removes an existing message from the user's project in Stripo. [See the documentation](https://api.stripo.email/reference/deleteemail)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    stripo,
    emailId: {
      propDefinition: [
        stripo,
        "emailId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.stripo.removeEmail({
      $,
      emailId: this.emailId,
    });
    $.export("$summary", `Successfully removed email with ID: ${this.emailId}`);
    return response;
  },
};
