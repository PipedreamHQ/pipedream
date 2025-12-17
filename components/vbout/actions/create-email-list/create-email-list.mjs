import common from "../common/base.mjs";

export default {
  ...common,
  key: "vbout-create-email-list",
  name: "Create Email List",
  description: "This action creates a new list. [See the docs here](https://developers.vbout.com/docs/1_0/#emailmarketing_addlist)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    name: {
      propDefinition: [
        common.props.vbout,
        "name",
      ],
    },
    emailSubject: {
      propDefinition: [
        common.props.vbout,
        "emailSubject",
      ],
      optional: true,
    },
    replyTo: {
      propDefinition: [
        common.props.vbout,
        "replyTo",
      ],
      optional: true,
    },
    fromEmail: {
      propDefinition: [
        common.props.vbout,
        "fromEmail",
      ],
      optional: true,
    },
    fromName: {
      propDefinition: [
        common.props.vbout,
        "fromName",
      ],
      optional: true,
    },
    doubleOptin: {
      propDefinition: [
        common.props.vbout,
        "doubleOptin",
      ],
      optional: true,
    },
    notify: {
      propDefinition: [
        common.props.vbout,
        "notify",
      ],
      optional: true,
    },
    notifyEmail: {
      propDefinition: [
        common.props.vbout,
        "notifyEmail",
      ],
      optional: true,
    },
    successEmail: {
      propDefinition: [
        common.props.vbout,
        "successEmail",
      ],
      optional: true,
    },
    successMessage: {
      propDefinition: [
        common.props.vbout,
        "successMessage",
      ],
      optional: true,
    },
    errorMessage: {
      propDefinition: [
        common.props.vbout,
        "errorMessage",
      ],
      optional: true,
    },
    confirmationEmail: {
      propDefinition: [
        common.props.vbout,
        "confirmationEmail",
      ],
      optional: true,
    },
    confirmationMessage: {
      propDefinition: [
        common.props.vbout,
        "confirmationMessage",
      ],
      optional: true,
    },
    communications: {
      propDefinition: [
        common.props.vbout,
        "communications",
      ],
      optional: true,
    },
  },
  methods: {
    async processEvent($) {
      const {
        name,
        emailSubject,
        replyTo,
        fromEmail,
        fromName,
        doubleOptin,
        notify,
        notifyEmail,
        successEmail,
        successMessage,
        errorMessage,
        confirmationEmail,
        confirmationMessage,
        communications,
      } = this;
      return this.vbout.createEmailList({
        $,
        params: {
          name,
          email_subject: emailSubject,
          reply_to: replyTo,
          fromemail: fromEmail,
          from_name: fromName,
          doubleOptin,
          notify,
          notify_email: notifyEmail,
          success_email: successEmail,
          success_message: successMessage,
          error_message: errorMessage,
          confirmation_email: confirmationEmail,
          confirmation_message: confirmationMessage,
          communications: Number(communications),
        },
      });
    },
    getSummary() {
      return `List ${this.name} Successfully created!`;
    },
  },
};
