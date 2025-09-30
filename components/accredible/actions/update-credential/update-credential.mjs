import accredible from "../../accredible.app.mjs";

export default {
  key: "accredible-update-credential",
  name: "Update Credential",
  description: "Modify the details of an existing credential. [See the documentation](https://accrediblecredentialapi.docs.apiary.io/#reference/credentials/credential/update-a-credential)",
  version: "0.0.2",
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
    email: {
      propDefinition: [
        accredible,
        "recipientEmail",
      ],
    },
    name: {
      propDefinition: [
        accredible,
        "recipientName",
      ],
    },
    groupId: {
      optional: true,
      propDefinition: [
        accredible,
        "groupId",
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
    const {
      accredible,
      credentialId,
      email,
      name,
      groupId,
      credentialData,
    } = this;

    const response = await accredible.updateCredential({
      $,
      credentialId,
      data: {
        credential: {
          recipient: {
            email,
            name,
          },
          group_id: groupId,
          ...credentialData,
        },
      },
    });
    $.export("$summary", `Successfully updated credential with ID: \`${response.credential.id}\`.`);
    return response;
  },
};
