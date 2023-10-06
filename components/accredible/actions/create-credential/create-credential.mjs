import accredible from "../../accredible.app.mjs";

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
        "recipientEmail",
      ],
    },
    credentialData: {
      propDefinition: [
        accredible,
        "credentialData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.accredible.createCredential({
      recipientEmail: this.recipientEmail,
      credentialData: this.credentialData,
    });
    $.export("$summary", `Successfully created credential for ${this.recipientEmail}`);
    return response;
  },
};
