import accredible from "../../accredible.app.mjs"

export default {
  key: "accredible-create-credential",
  name: "Create Credential",
  description: "Issue a new credential to a given recipient. [See the documentation](https://accrediblecredentialapi.docs.apiary.io)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    accredible,
    recipientEmail: {
      propDefinition: [
        accredible,
        "recipientEmail"
      ]
    },
    credential: {
      propDefinition: [
        accredible,
        "credential"
      ]
    },
  },
  async run({ $ }) {
    const response = await this.accredible.issueCredential({
      recipientEmail: this.recipientEmail,
      credential: this.credential,
    });
    $.export("$summary", `Successfully issued credential to ${this.recipientEmail}`);
    return response;
  },
};