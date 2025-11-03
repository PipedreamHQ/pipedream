import sendinBlueApp from "../../sendinblue.app.mjs";

export default {
  key: "sendinblue-send-transactional-email",
  name: "Send Transactional Email",
  description: "Send transactional email. [See the docs](https://developers.sendinblue.com/reference/sendtransacemail) for more information.",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sendinBlueApp,
    useTemplate: {
      type: "boolean",
      label: "Use Template",
      description: "Should use template?",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const dynamicProps = {};
    if (this.useTemplate) {
      dynamicProps.templateId = {
        label: "Template Id",
        type: "integer",
        min: 0,
        max: Number.MAX_SAFE_INTEGER,
        description: "Id of the template.",
        options: async ({ prevContext }) => {
          return this.sendinBlueApp.getTemplatesPaginated(prevContext);
        },
      };
    } else {
      dynamicProps.sender = {
        type: "string",
        label: "Sender",
        description: "Pass name (optional) and email or id of sender from which emails will be sent.\nName will be ignored if passed along with sender id.\n**Example:** `{ \"name\": \"John Doe\", \"email\": \"john@doe.com\" }` or `{ \"id\": 1 }`",
        options: async ({ prevContext }) => {
          return this.sendinBlueApp.getSendersFormattedOptions(prevContext);
        },
      };
      dynamicProps.subject = {
        type: "string",
        label: "Subject",
        description: "Subject of the message.",
      };
      dynamicProps.htmlContent = {
        type: "string",
        label: "Html Content",
        description: "HTML body of the message.",
      };
      dynamicProps.textContent = {
        type: "string",
        label: "Text Content",
        optional: true,
        description: "Plain Text body of the message.",
      };
    }
    const props = {
      ...dynamicProps,
      replyTo: {
        type: "string",
        label: "Reply To",
        optional: false,
        description: "Email (required), along with name (optional), on which transactional mail recipients will be able to reply back.\n\n**Example:** `{ \"name\": \"John Doe\", \"email\": \"john@doe.com\" }`",
        options: async ({ prevContext }) => {
          return this.sendinBlueApp.getSendersFormattedOptions(prevContext);
        },
      },
      to: {
        type: "string[]",
        label: "To",
        description: "List of email addresses and names (optional) of the recipients.\n\n**Example:** `[{ \"name\": \"John Doe\", \"email\": \"john@doe.com\" }, { \"name\": \"Jane Doe\", \"email\": \"jane@doe.com\" }]`",
        optional: false,
        options: async ({ prevContext }) => {
          return this.sendinBlueApp.getContactsPaginated(prevContext, true);
        },
      },
      cc: {
        type: "string[]",
        label: "CC",
        optional: true,
        description: "List of email addresses and names (optional) of the recipients in cc.\n\n**Example:** `[{ \"name\": \"John Doe\", \"email\": \"john@doe.com\" }, { \"name\": \"Jane Doe\", \"email\": \"jane@doe.com\" }]`",
        options: async ({ prevContext }) => {
          return this.sendinBlueApp.getContactsPaginated(prevContext, true);
        },
      },
      bcc: {
        type: "string[]",
        label: "BCC",
        optional: true,
        description: "List of email addresses and names (optional) of the recipients in bcc.\n\n**Example:** `[{ \"name\": \"John Doe\", \"email\": \"john@doe.com\" }, { \"name\": \"Jane Doe\", \"email\": \"jane@doe.com\" }]`",
        options: async ({ prevContext }) => {
          return this.sendinBlueApp.getContactsPaginated(prevContext, true);
        },
      },
      tags: {
        type: "string[]",
        label: "Tags",
        optional: true,
        description: "Tag your emails to find them more easily.",
      },
      params: {
        type: "string",
        label: "Params",
        description: "All key-value properties that will be replaced in the template e.g. `{\"ORDER\": 12345, \"DATE\": \"12/06/2019\"}`",
        optional: true,
      },
    };

    return props;
  },
  methods: {
    formatEmailProp(prop, field) {
      if (typeof (prop) === "string") {
        prop = JSON.parse(prop);
      }
      if (!Array.isArray(prop)) {
        throw new Error(`Field "${field}" should be an array`, prop);
      }
      if (typeof prop[0] === "string") {
        return Object.keys(prop).map((key) => JSON.parse(prop[key]));
      }
      return prop;
    },
  },
  async run({ $ }) {
    const sender = this.sender ?
      JSON.parse(this.sender) :
      null;
    const replyTo = this.replyTo ?
      JSON.parse(this.replyTo) :
      null;
    const params = this.params ?
      JSON.parse(this.params) :
      null;

    const tags = this.tags ?
      Object.keys(this.tags).map((key) => this.tags[key])
      : null;
    const to = this.to
      ? this.formatEmailProp(this.to, "To")
      : null;
    const cc = this.cc
      ? this.formatEmailProp(this.cc, "CC")
      : null;
    const bcc = this.bcc
      ? this.formatEmailProp(this.bcc, "BCC")
      : null;

    if (!Array.isArray(to) || to.length === 0) {
      throw new Error("Must provide field \"To\".");
    }

    const emailSent = await this.sendinBlueApp.sendTransactionalEmail(
      $,
      this.useTemplate,
      this.templateId,
      sender,
      replyTo,
      to,
      this.subject,
      this.htmlContent,
      this.textContent,
      tags,
      cc,
      bcc,
      params,
    );
    $.export("$summary", "Transactional email successfully sent");
    return emailSent;
  },
};
