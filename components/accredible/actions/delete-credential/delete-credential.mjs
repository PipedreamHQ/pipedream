import accredible from "../../accredible.app.mjs";

export default {
  key: "accredible-delete-credential",
  name: "Delete Credential",
  description: "Remove a specific credential from the system. [See the documentation](https://accrediblecredentialapi.docs.apiary.io/#reference/credentials/credential/delete-a-credential)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    const {
      accredible,
      credentialId,
    } = this;

    const response = await accredible.deleteCredential({
      $,
      credentialId,
    });
    $.export("$summary", `Successfully deleted credential with ID: \`${response.credential.id}\`.`);
    return response;
  },
};
