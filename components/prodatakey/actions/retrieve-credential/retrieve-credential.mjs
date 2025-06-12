import prodatakey from "../../prodatakey.app.mjs";

export default {
  key: "prodatakey-retrieve-credential",
  name: "Retrieve Credential",
  description: "Retrieve a specific credential using the system ID, holder ID, and credential ID. [See the documentation](https://developer.pdk.io/web/2.0/rest/credentials)",
  version: "0.0.1",
  type: "action",
  props: {
    prodatakey,
    organizationId: {
      propDefinition: [
        prodatakey,
        "organizationId",
      ],
    },
    holderId: {
      propDefinition: [
        prodatakey,
        "holderId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
    },
    credentialId: {
      propDefinition: [
        prodatakey,
        "credentialId",
        ({
          organizationId, holderId,
        }) => ({
          organizationId,
          holderId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.prodatakey.retrieveCredential({
      $,
      organizationId: this.organizationId,
      holderId: this.holderId,
      credentialId: this.credentialId,
    });

    $.export("$summary", `Successfully retrieved credential with ID ${response.id}`);
    return response;
  },
};
