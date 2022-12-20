import validate from "validate.js";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "sendgrid-send-email-single-recipient",
  name: "Send Email Single Recipient",
  description: "This action sends a personalized e-mail to the specified recipient. [See the docs here](https://docs.sendgrid.com/api-reference/mail-send/mail-send)",
  version: "0.0.4",
  type: "action",
  props: {
    ...common.props,
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
    toEmail: {
      type: "string",
      label: "To Email",
      description: "The intended recipient's email address",
    },
    toName: {
      type: "string",
      label: "To Name",
      description: "The intended recipient's name",
      optional: true,
    },
    cc: {
      type: "string",
      label: "CC",
      description:
        "An array of recipients who will receive a copy of your email. Each object in this array must contain the recipient's email address. Each object in the array may optionally contain the recipient's name. Alternatively, provide a string that will `JSON.parse` to an array of recipient objects. Example: `[{\"email\":\"email@example.com\",\"name\":\"Example Recipient\"}]`",
      optional: true,
    },
    bcc: {
      type: "string",
      label: "BCC",
      description: "An array of recipients who will receive a blind copy of your email. Each object in this array must contain the recipient's email address. Each object in the array may optionally contain the recpient's name. Alternatively, provide a string that will `JSON.parse` to an array of recipient objects. Example: `[{\"email\":\"email@example.com\",\"name\":\"Example Recipient\"}]`",
      optional: true,
    },
    personalizationHeaders: {
      type: "object",
      label: "Personalization.Headers",
      description: "An object containing key/value pairs allowing you to specify handling instructions for your email. You may not overwrite the following headers: `x-sg-id`, `x-sg-eid`, `received`, `dkim-signature`, `Content-Type`, `Content-Transfer-Encoding`, `To`, `From`, `Subject`, `Reply-To`, `CC`, `BCC`.",
      optional: true,
    },
    substitutions: {
      type: "string",
      label: "Substitutions",
      description: "Substitutions allow you to insert data without using Dynamic Transactional Templates. This field should not be used in combination with a Dynamic Transactional Template, which can be identified by a `template_id` starting with `d-`. This field is a collection of key/value pairs following the pattern `\"substitution_tag\":\"value to substitute\"`. The key/value pairs must be strings. These substitutions will apply to the text and html content of the body of your email, in addition to the `subject` and `reply-to` parameters. The total collective size of your substitutions may not exceed 10,000 bytes per personalization object.",
      optional: true,
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
    //Performs validation on parameters.
    validate.validators.arrayValidator = this.validateArray; //custom validator for object arrays
    //Defines constraints for required parameters
    const constraints = {
      toEmail: {
        email: true,
      },
      fromEmail: {
        email: true,
      },
    };
    //Defines constraints for optional parameters
    if (this.cc) {
      constraints.cc = {
        arrayValidator: {
          value: this.cc,
          key: "recipient",
        },
      };
    }
    if (this.bcc) {
      constraints.bcc = {
        arrayValidator: {
          value: this.bcc,
          key: "recipient",
        },
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
    if (this.replyToEmail) {
      constraints.replyToEmail = {
        email: true,
      };
    }
    this.sendAt = this.convertEmptyStringToUndefined(this.sendAt);
    if (this.sendAt != null) {
      constraints.sendAt = this.getIntegerGtZeroConstraint();
    }
    //Executes validation
    const validationResult = validate(
      {
        toEmail: this.toEmail,
        cc: this.cc,
        bcc: this.bcc,
        fromEmail: this.fromEmail,
        replyToEmail: this.replyToEmail,
        attachments: this.attachments,
        categories: this.categories,
        sendAt: this.sendAt,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    //Set ups the `personalizations` object, where `to`, `cc`, and `bcc` recipients are specified,
    //with `to` being required.
    const personalizations = [
      {},
    ];
    personalizations[0].to = [
      {
        email: this.toEmail,
      },
    ];
    if (this.toName) {
      personalizations[0].to[0].name = this.toName;
    }
    if (this.cc) {
      personalizations[0].cc = this.getArrayObject(this.cc);
    }
    if (this.bcc) {
      personalizations[0].bcc = this.getArrayObject(this.bcc);
    }
    if (this.personalizationHeaders) {
      personalizations[0].headers = this.convertEmptyStringToUndefined(this.personalizationHeaders);
    }
    if (this.substitutions) {
      personalizations[0].substitutions = this.substitutions;
    }
    if (this.dynamicTemplateData) {
      personalizations[0].dynamic_template_data = this.dynamicTemplateData;
    }
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
      personalizations,
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
