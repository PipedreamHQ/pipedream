import certifier from "../../certifier.app.mjs";

export default {
  name: "Issue Credential",
  version: "0.0.1",
  key: "certifier-issue-credential",
  description:
    "Create, issue and send a credential to a recipient. [See the documentation](https://developers.certifier.io/reference/create-issue-send-a-credential)",
  props: {
    certifier,
    groupId: {
      propDefinition: [
        certifier,
        "groupId",
      ],
      // reloadProps is used so that customAttributes can be loaded
      // However, note that in the Certifier app custom attributes
      // are defined on a workspace level, not group
      reloadProps: true,
    },
    recipientName: {
      propDefinition: [
        certifier,
        "recipientName",
      ],
    },
    recipientEmail: {
      propDefinition: [
        certifier,
        "recipientEmail",
      ],
    },
    issueCredential: {
      propDefinition: [
        certifier,
        "issueCredential",
      ],
    },
    sendCredential: {
      propDefinition: [
        certifier,
        "sendCredential",
      ],
    },
    issueDate: {
      propDefinition: [
        certifier,
        "issueDate",
      ],
    },
    expiryDate: {
      propDefinition: [
        certifier,
        "expiryDate",
      ],
    },
  },
  async additionalProps() {
    const attributes = await this.certifier.searchAttributes();
    return attributes
      .filter((attribute) => !attribute.isDefault)
      .reduce(
        (acc, attribute) => ({
          ...acc,
          [attribute.tag]: {
            type: "string",
            label: `Custom Attribute: ${attribute.name}`,
            optional: true,
          },
        }),
        {},
      );
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const {
      certifier,
      groupId,
      recipientName,
      recipientEmail,
      issueCredential,
      sendCredential,
      issueDate,
      expiryDate,
    } = this;

    const customAttributes = Object.fromEntries(
      Object.entries(this).filter(([
        key,
      ]) => key.startsWith("custom.")),
    );

    let response = await certifier.createCredential({
      $,
      data: {
        groupId: groupId,
        recipient: {
          email: recipientEmail,
          name: recipientName,
        },
        customAttributes,
        ...(issueDate && {
          issueDate,
        }),
        ...(expiryDate && {
          expiryDate,
        }),
      },
    });

    console.log(`Successfully created credential with ID \`${response.id}\`.`);

    if (issueCredential) {
      response = await certifier.issueCredential(response.id, {
        $,
      });

      console.log(`Successfully issued credential with ID \`${response.id}\`.`);

      if (sendCredential) {
        response = await certifier.sendCredential(response.id, {
          $,
          data: {
            deliveryMethod: "email",
          },
        });

        console.log(`Successfully sent credential with ID \`${response.id}\`.`);
      }
    }

    $.export(
      "$summary",
      `Successfully created credential for ${response.recipient.name}`,
    );

    return response;
  },
};
