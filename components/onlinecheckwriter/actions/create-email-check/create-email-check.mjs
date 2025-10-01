import app from "../../onlinecheckwriter.app.mjs";

export default {
  key: "onlinecheckwriter-create-email-check",
  name: "Create Email Check",
  description: "Create an email check for a payee. [See the documentation](https://apiv3.onlinecheckwriter.com/#211cb6e4-bda7-46de-9e84-a5e8b2709206).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    checkId: {
      propDefinition: [
        app,
        "checkId",
      ],
    },
    payeeEmail: {
      optional: false,
      propDefinition: [
        app,
        "payeeEmail",
      ],
    },
    enableSmsInform: {
      propDefinition: [
        app,
        "enableSmsInform",
      ],
    },
    payeePhone: {
      optional: false,
      description: "Required if **Enable SMS Inform** is `true` and not exist any phone on associated payee,",
      propDefinition: [
        app,
        "payeePhone",
      ],
    },
    sendAttachment: {
      type: "boolean",
      label: "Send Attachment",
      description: "This will send added attachments along with the check.",
      optional: true,
    },
  },
  methods: {
    createEmailChecks(args = {}) {
      return this.app.post({
        path: "/emailchecks",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createEmailChecks,
      checkId,
      payeeEmail,
      enableSmsInform,
      payeePhone,
      sendAttachment,
    } = this;

    const response = await createEmailChecks({
      $,
      data: {
        emailChecks: [
          {
            checkId,
            payeeEmail,
            enableSmsInform,
            payeePhone,
            ...(sendAttachment !== undefined && {
              sendAttachment: +sendAttachment,
            }),
          },
        ],
      },
    });
    $.export("$summary", "Successfully created email checks.");
    return response;
  },
};
