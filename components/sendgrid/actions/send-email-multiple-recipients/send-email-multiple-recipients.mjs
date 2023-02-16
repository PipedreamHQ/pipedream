import validate from "validate.js";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "sendgrid-send-email-multiple-recipients",
  name: "Send Email Multiple Recipients",
  description: "This action sends a personalized e-mail to multiple specified recipients. [See the docs here](https://docs.sendgrid.com/api-reference/mail-send/mail-send)",
  version: "0.0.3",
  type: "action",
  props: {
    ...common.props,
    personalizations: {
      type: "string",
      label: "Personalizations",
      description: "An array of messages and their metadata. Each object within personalizations can be thought of as an envelope - it defines who should receive an individual message and how that message should be handled. See our [Personalizations documentation](https://sendgrid.com/docs/for-developers/sending-email/personalizations/) for details. maxItems: 1000. Example: `[{to:[{email:\"email@email.com\",name:\"Example\"}],subject:\"Mail Personalization Sample\"}]`",
      optional: true,
    },
    toEmails: {
      type: "string[]",
      label: "Recipient Emails",
      description: "The intended recipients' email addresses. Will be ignored if `personalizations` prop is used.",
      optional: true,
    },
    fromEmail: {
      propDefinition: [
        common.props.sendgrid,
        "fromEmail",
      ],
    },
    fromName: {
      propDefinition: [
        common.props.sendgrid,
        "fromName",
      ],
    },
    dynamicTemplateData: {
      type: "object",
      label: "Dynamic Template Data",
      description: "Dynamic template data is available using Handlebars syntax in Dynamic Transactional Templates. This field should be used in combination with a Dynamic Transactional Template, which can be identified by a template_id starting with d-. This field is a collection of key/value pairs following the pattern `\"variable_name\":\"value to insert\"`",
      optional: true,
    },
    templateId: {
      propDefinition: [
        common.props.sendgrid,
        "templateId",
      ],
      optional: true,
    },
    replyToEmail: {
      propDefinition: [
        common.props.sendgrid,
        "replyToEmail",
      ],
    },
    replyToName: {
      propDefinition: [
        common.props.sendgrid,
        "replyToName",
      ],
    },
    subject: {
      propDefinition: [
        common.props.sendgrid,
        "subject",
      ],
      description: "The global or `message level` subject of your email. This may be overridden by subject lines set -in personalizations.",
    },
    content: {
      propDefinition: [
        common.props.sendgrid,
        "content",
      ],
      optional: true,
    },
    attachments: {
      propDefinition: [
        common.props.sendgrid,
        "attachments",
      ],
    },
    headers: {
      propDefinition: [
        common.props.sendgrid,
        "headers",
      ],
    },
    categories: {
      propDefinition: [
        common.props.sendgrid,
        "categories",
      ],
    },
    customArgs: {
      propDefinition: [
        common.props.sendgrid,
        "customArgs",
      ],
    },
    sendAt: {
      propDefinition: [
        common.props.sendgrid,
        "sendAt",
      ],
    },
    asm: {
      propDefinition: [
        common.props.sendgrid,
        "asm",
      ],
    },
    ipPoolName: {
      propDefinition: [
        common.props.sendgrid,
        "ipPoolName",
      ],
    },
    mailSettings: {
      propDefinition: [
        common.props.sendgrid,
        "mailSettings",
      ],
    },
    trackingSettings: {
      propDefinition: [
        common.props.sendgrid,
        "trackingSettings",
      ],
    },
  },
  async run({ $ }) {
    const personalizations = this.personalizations || [];
    if (personalizations.length == 0) {
      for (const toEmail of this.toEmails) {
        const personalization = {
          to: [
            {
              email: toEmail,
            },
          ],
        };
        personalizations.push(personalization);
      }
    }
    if (this.dynamicTemplateData) {
      for (const personalization of personalizations) {
        personalization.dynamic_template_data = this.dynamicTemplateData;
      }
    }
    //Performs validation on parameters.
    validate.validators.arrayValidator = this.validateArray; //custom validator for object arrays
    //Defines contraints for required parameters
    const constraints = {
      personalizations: {
        type: "array",
      },
      fromEmail: {
        email: true,
      },
    };
    //Defines contraints for optional parameters
    if (this.replyToEmail) {
      constraints.replyToEmail = {
        email: true,
      };
    }
    let attachments = this.convertEmptyStringToUndefined(this.attachments);
    if (this.attachments) {
      constraints.attachments = {
        arrayValidator: {
          value: this.attachments,
          key: "attachments",
        },
      };
      attachments = this.getArrayObject(this.attachments);
    }
    if (this.categories) {
      constraints.categories = {
        type: "array",
      };
    }
    this.sendAt = this.convertEmptyStringToUndefined(this.sendAt);
    if (this.sendAt != null) {
      constraints.sendAt = this.getIntegerGtZeroConstraint();
    }
    //Executes validation
    const validationResult = validate(
      {
        personalizations: this.personalizations,
        fromEmail: this.fromEmail,
        replyToEmail: this.replyToEmail,
        subject: this.subject,
        attachments: this.attachments,
        categories: this.categories,
        sendAt: this.sendAt,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    //Set ups the `from` object, where `email`, `name` of the mail sender are specified, with
    //`email` being required.
    const from = {
      email: this.fromEmail,
    };
    if (this.fromName) {
      from.name = this.fromName;
    }
    //Set ups the `reply_to` object, where `email`, `name` of the reply-to recipient are
    //specified, with `email` being required.
    let replyTo = undefined;
    if (this.replyToEmail) {
      replyTo = {
        email: this.replyToEmail,
      };
      if (this.replyToName) {
        replyTo.name = this.replyToName;
      }
    }

    //Prepares and sends the request configuration
    const config = this.omitEmptyStringValues({
      personalizations: this.getArrayObject(personalizations),
      from,
      reply_to: replyTo,
      subject: this.subject,
      content: this.content && [
        {
          type: "text/html",
          value: this.content,
        },
      ],
      attachments,
      headers: this.headers,
      categories: this.categories,
      custom_args: this.customArgs,
      send_at: this.sendAt,
      asm: this.asm,
      ip_pool_name: this.ipPoolName,
      mail_settings: this.mailSettings,
      tracking_settings: this.trackingSettings,
      template_id: this.templateId,
    });
    const resp = await this.sendgrid.sendEmail(config);
    $.export("$summary", "Email successfully sent");
    return resp;
  },
};
