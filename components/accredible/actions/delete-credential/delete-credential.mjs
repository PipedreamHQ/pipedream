js;
import accredible from "../../accredible.app.mjs";

export default {
  key: "accredible-delete-credential",
  name: "Delete Credential",
  description: "Remove a specific credential from the system. [See the documentation](https://accrediblecredentialapi.docs.apiary.io)",
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
  },
  async run({ $ }) {
    const response = await this.accredible.deleteCredential({
      credentialId: this.credentialId,
    });
    $.export("$summary", `Successfully deleted credential with ID: ${this.credentialId}`);
    return response;
  },
};
