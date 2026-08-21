import app from "../../mailtrap.app.mjs";

export default {
  name: "Create Suppression",
  description:
    "Add an email address to the suppression list so Mailtrap stops sending to it. [See the documentation]" +
    "(https://docs.mailtrap.io/developers/email-sending/suppressions#post-api-suppressions)",
  key: "mailtrap-create-suppression",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "The email address to suppress.",
    },
    domainId: {
      propDefinition: [
        app,
        "domainId",
      ],
    },
    sendingStream: {
      type: "string",
      label: "Sending Stream",
      description: "The sending stream to suppress this email address for, e.g. `transactional`.",
      options: [
        "transactional",
        "bulk",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "The reason for the suppression, e.g. `manual import`.",
      options: [
        "hard bounce",
        "unsubscription",
        "spam complaint",
        "manual import",
      ],
      default: "manual import",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      email, domainId, sendingStream, type,
    } = this;

    const response = await this.app.createSuppression({
      $,
      data: {
        email,
        domain_id: domainId,
        sending_stream: sendingStream,
        ...(type && {
          type,
        }),
      },
    });

    $.export("$summary", `Suppressed ${email}`);
    return response;
  },
};
