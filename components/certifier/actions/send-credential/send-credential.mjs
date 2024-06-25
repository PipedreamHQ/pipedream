import certifier from "../../certifier.app.mjs";

export default {
  name: "Send Credential",
  version: "0.0.1",
  key: "certifier-send-credential",
  description:
    "Send an existing credential. [See the documentation](https://developers.certifier.io/reference/send-a-credential)",
  props: {
    certifier,
    credentialId: {
      propDefinition: [
        certifier,
        "credentialId",
      ],
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const {
      certifier, credentialId,
    } = this;

    const response = await certifier.sendCredential(credentialId, {
      $,
      data: {
        deliveryMethod: "email",
      },
    });
    console.log(`Successfully sent credential with ID \`${response.id}\`.`);

    $.export(
      "$summary",
      `Successfully sent credential for ${response.recipient.name}`,
    );

    return response;
  },
};
