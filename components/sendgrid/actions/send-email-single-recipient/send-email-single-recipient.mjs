import { getFileStream } from "@pipedream/platform";
import mime from "mime";
import validate from "validate.js";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "sendgrid-send-email-single-recipient",
  name: "Send Email Single Recipient",
  description: "This action sends a personalized e-mail to the specified recipient. [See the docs here](https://docs.sendgrid.com/api-reference/mail-send/mail-send)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    asmGroupId: {
      propDefinition: [
        common.props.sendgrid,
        "asmGroupId",
      ],
    },
    asmGroupsToDisplay: {
      propDefinition: [
        common.props.sendgrid,
        "asmGroupsToDisplay",
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
    numberOfAttachments: {
      propDefinition: [
        common.props.sendgrid,
        "numberOfAttachments",
      ],
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.numberOfAttachments) {
      for (let i = 1; i <= this.numberOfAttachments; i++) {
        props[`attachmentsName${i}`] = {
          type: "string",
          label: `Attachment File Name ${i}`,
          description: "The name of the file.",
          optional: true,
        };
        props[`attachmentsPath${i}`] = {
          type: "string",
          label: `Attachment File Path or URL ${i}`,
          description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`).",
          optional: true,
        };
      }
    }
    return props;
  },
  async run({ $ }) {
    //Performs validation on parameters.
    validate.validators.arrayValidator = this.validateArray; //custom validator for object arrays
    validate.validators.asmValidator = this.validateAsm; //custom validator for asm object
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
    if (this.asm || this.asmGroupsToDisplay) {
      constraints.asm = {
        asmValidator: {
          asm: this.asm,
          asmGroupId: this.asmGroupId,
          asmGroupsToDisplay: this.asmGroupsToDisplay,
        },
      };
    }
    const attachments = [];
    for (let i = 1; i <= this.numberOfAttachments; i++) {
      const filepath = this["attachmentsPath" + i];
      const stream = await getFileStream(filepath);
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const content = Buffer.concat(chunks).toString("base64");
      const type = mime.getType(filepath);
      attachments.push({
        content,
        type,
        filename: this[`attachmentsName${i}`],
      });
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
    this.sendAt = this.convertEmptyStringToUndefined(Date.parse(this.sendAt));
    if (this.sendAt) {
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
      const ccArray = this.getArrayObject(this.cc);

      if (ccArray?.length) {
        personalizations[0].cc = ccArray;
      }
    }
    if (this.bcc) {
      const bccArray = this.getArrayObject(this.bcc);

      if (bccArray?.length) {
        personalizations[0].bcc = bccArray;
      }
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
      asm: this.getAsmConfig(),
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
