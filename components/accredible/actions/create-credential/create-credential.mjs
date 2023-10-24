import accredible from "../../accredible.app.mjs";

export default {
  key: "accredible-create-credential",
  name: "Create Credential",
  description: "Issue a new credential to a given recipient. [See the documentation](https://accrediblecredentialapi.docs.apiary.io)",
  version: "0.0.1",
  type: "action",
  props: {
    accredible,
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
      email,
      name,
      groupId,
      credentialData,
    } = this;

    const response = await accredible.createCredential({
      $,
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
    $.export("$summary", `Successfully created credential for ${this.recipientEmail}`);
    return response;
  },
};
