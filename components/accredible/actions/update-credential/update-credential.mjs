import accredible from "../../accredible.app.mjs";

export default {
  key: "accredible-update-credential",
  name: "Update Credential",
  description: "Modify the details of an existing credential. [See the documentation](https://accrediblecredentialapi.docs.apiary.io)",
  version: "0.0.1",
  type: "action",
  props: {
    accredible,
    credentialId: {
      propDefinition: [
        accredible,
        "credentialId",
      ],
    },
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
    const response = await this.accredible.updateCredential({
      credentialId: this.credentialId,
      credentialData: {
        recipient: {
          email: this.recipientEmail,
        },
        ...this.credentialData,
      },
    });
    $.export("$summary", `Successfully updated credential with ID: ${this.credentialId}`);
    return response;
  },
};
