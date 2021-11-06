const validate = require("validate.js");
const common = require("../common");

module.exports = {
  ...common,
  key: "sendgrid-send-email-single-recipient",
  name: "Send Email Single Recipient",
  description:
    "This action sends a personalized e-mail to the specified recipient.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    fromEmail: {
      type: "string",
      label: "From Email",
      description:
        "The 'From' email address used to deliver the message. This address should be a verified sender in your Twilio SendGrid account.",
    },
    fromName: {
      type: "string",
      label: "From Name",
      description: "A name or title associated with the sending email address.",
      optional: true,
    },
    toEmail: {
      type: "string",
      label: "To Email",
      description:
        "The intended recipient's name.",
    },
    toName: {
      type: "string",
      label: "From Name",
      description: "A name or title associated with the sending email address.",
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
      description:
      "An array of recipients who will receive a blind copy of your email. Each object in this array must contain the recipient's email address. Each object in the array may optionally contain the recpient's name. Alternatively, provide a string that will `JSON.parse` to an array of recipient objects. Example: `[{\"email\":\"email@example.com\",\"name\":\"Example Recipient\"}]`",
      optional: true,
    },
    headers: {
      type: "string",
      label: "Headers",
      description:
      "A collection of JSON key/value pairs allowing you to specify handling instructions for your email. You may not overwrite the following headers: `x-sg-id`, `x-sg-eid`, `received`, `dkim-signature`, `Content-Type`, `Content-Transfer-Encoding`, `To`, `From`, `Subject`, `Reply-To`, `CC`, `BCC`.",
      optional: true,
    },
    substitutions: {
      type: "string",
      label: "Substitutions",
      description:
      "Substitutions allow you to insert data without using Dynamic Transactional Templates. This field should not be used in combination with a Dynamic Transactional Template, which can be identified by a `template_id` starting with `d-`. This field is a collection of key/value pairs following the pattern `\"substitution_tag\":\"value to substitute\"`. The key/value pairs must be strings. These substitutions will apply to the text and html content of the body of your email, in addition to the `subject` and `reply-to` parameters. The total collective size of your substitutions may not exceed 10,000 bytes per personalization object.",
      optional: true,
    },
    dynamicTemplateData: {
      type: "string",
      label: "Dynamic Template Data",
      description:
      "Dynamic template data is available using Handlebars syntax in Dynamic Transactional Templates. This field should be used in combination with a Dynamic Transactional Template, which can be identified by a template_id starting with d-. This field is a collection of key/value pairs following the pattern `\"variable_name\":\"value to insert\"`",
      optional: true,
    },
    replyToEmail: {
      type: "string",
      label: "Reply To Email",
      description:
        "The email address where any replies or bounces will be returned.",
      optional: true,
    },
    replyToName: {
      type: "string",
      label: "Reply To Name",
      description:
        "A name or title associated with the `replyToEmail` address.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description:
        "The global or `message level` subject of your email.",
    },
    content: {
      type: "string",
      label: "Content",
      description:
        "An string array where you can specify the content of your email. You can include multiple of content, but you must specify at least one [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types). To include more than one MIME type, add another object to the array containing the type and value parameters. Alternatively, provide a string that will `JSON.parse` to an array of content objects. Example: `[{type:\"text/plain\",value:\"Plain text content.\"}]`",
    },
    attachments: {
      type: "string",
      label: "Attachments",
      description:
      "An array of objects where you can specify any attachments you want to include. The fields `content` and `filename` are required. `content` must be base64 encoded. Alternatively, provide a string that will `JSON.parse` to an array of attachments objects. Example: `[{content:\"aGV5\",type:\"text/plain\",filename:\"sample.txt\"}]`",
      optional: true,
    },
    templateId: {
      type: "string",
      label: "Template Id",
      description:
        "An email template ID. A template that contains a subject and content — either text or html — will override any subject and content values specified at the personalizations or message level.",
      optional: true,
    },
    categories: {
      type: "string[]",
      label: "Categories",
      description:
        "A string array of category names for this message. Each category name may not exceed 255 characters. Example: `[\"category1\",\"category2\"]`",
      optional: true,
    },
    customArgs: {
      type: "string",
      label: "Custom Args",
      description:
        "Values that are specific to the entire send that will be carried along with the email and its activity data. Key/value pairs must be strings. Substitutions will not be made on custom arguments, so any string that is entered into this parameter will be assumed to be the custom argument that you would like to be used. This parameter is overridden by `custom_args` set at the personalizations level. Total `custom_args` size may not exceed 10,000 bytes.",
      optional: true,
    },
    sendAt: {
      type: "integer",
      label: "Send At",
      description:
        "A unix timestamp allowing you to specify when you want your email to be delivered. This may be overridden by the `send_at` parameter set at the personalizations level. Delivery cannot be scheduled more than 72 hours in advance. If you have the flexibility, it's better to schedule mail for off-peak times. Most emails are scheduled and sent at the top of the hour or half hour. Scheduling email to avoid peak times — for example, scheduling at 10:53 — can result in lower deferral rates due to the reduced traffic during off-peak times.",
      optional: true,
    },
    batchId: {
      type: "integer",
      label: "Batch Id",
      description:
        "An ID representing a batch of emails to be sent at the same time. Including a batch_id in your request allows you include this email in that batch. It also enables you to cancel or pause the delivery of that batch. For more information, see the [Cancel Scheduled Sends API](https://sendgrid.com/docs/api-reference/).",
      optional: true,
    },
    asm: {
      type: "object",
      label: "ASM",
      description:
        "Advanced Suppression Manager. An object allowing you to specify how to handle unsubscribes.",
      optional: true,
    },
    ipPoolName: {
      type: "string",
      label: "Ip Pool Name",
      description: "The IP Pool that you would like to send this email from.",
      optional: true,
    },
    mailSettings: {
      type: "object",
      label: "Mail Settings",
      description:
        "A collection of different mail settings that you can use to specify how you would like this email to be handled.",
      optional: true,
    },
    trackingSettings: {
      type: "object",
      label: "Tracking Settings",
      description:
        "Settings to determine how you would like to track the metrics of how your recipients interact with your email.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
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
      content: {
        arrayValidator: {
          value: this.content,
          key: "content",
        },
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
    if (this.attachments) {
      constraints.attachments = {
        arrayValidator: {
          value: this.attachments,
          key: "attachments",
        },
      };
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
    this.batchId = this.convertEmptyStringToUndefined(this.batchId);
    if (this.batchId != null) {
      constraints.batchId = this.getIntegerGtZeroConstraint();
    }
    //Executes validation
    const validationResult = validate(
      {
        toEmail: this.toEmail,
        cc: this.cc,
        bcc: this.bcc,
        fromEmail: this.fromEmail,
        replyToEmail: this.replyToEmail,
        content: this.content,
        attachments: this.attachments,
        categories: this.categories,
        sendAt: this.sendAt,
        batchId: this.batchId,
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
    if (this.substitutions) {
      personalizations[0].substitutions = this.substitutions;
    }
    if (this.dynamicTemplateData) {
      personalizations[0].dynamicTemplateData = this.dynamicTemplateData;
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
      replyTo.email = this.replyToEmail;
      if (this.replyToName) {
        replyTo.name = this.replyToName;
      }
    }
    //Prepares and sends the request configuration
    const config = {
      personalizations,
      from,
      reply_to: replyTo,
      subject: this.subject,
      content: this.getArrayObject(this.content),
      attachments: this.getArrayObject(this.attachments),
      template_id: this.templateId,
      headers: this.convertEmptyStringToUndefined(this.headers),
      categories: this.convertEmptyStringToUndefined(this.categories),
      custom_args: this.customArgs,
      send_at: this.sendAt,
      batch_id: this.batchId,
      asm: this.convertEmptyStringToUndefined(this.asm),
      ip_pool_name: this.ipPoolName,
      mail_settings: this.convertEmptyStringToUndefined(this.mailSettings),
      tracking_settings: this.convertEmptyStringToUndefined(this.trackingSettings),
    };
    return await this.sendgrid.sendEmail(config);
  },
};
