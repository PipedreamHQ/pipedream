import accredible from "../../accredible.app.mjs";

export default {
  key: "accredible-update-credential",
  name: "Update Credential",
  description: "Modify the details of an existing credential. [See the documentation](https://accrediblecredentialapi.docs.apiary.io)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    accredible,
    credentialId: {
      propDefinition: [
        accredible,
        "credentialId",
      ],
    },
    credential: {
      propDefinition: [
        accredible,
        "credential",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.accredible.updateCredential({
      credentialId: this.credentialId,
      credential: this.credential,
    });
    $.export("$summary", `Successfully updated credential with ID: ${this.credentialId}`);
    return response;
  },
};
