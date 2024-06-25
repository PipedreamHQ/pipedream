import certifier from "../../certifier.app.mjs";

export default {
  name: "Issue Existing Draft Credential",
  version: "0.0.1",
  key: "certifier-issue-existing-draft-credential",
  description:
    "Issue an existing draft credential. [See the documentation](https://developers.certifier.io/reference/issue-a-credential)",
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

    const response = await certifier.issueCredential(credentialId, {
      $,
    });
    console.log(`Successfully issued credential with ID \`${response.id}\`.`);

    $.export(
      "$summary",
      `Successfully issued credential for ${response.recipient.name}`,
    );

    return response;
  },
};
