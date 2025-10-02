import { ConfigurationError } from "@pipedream/platform";
import {
  MESSAGE_FORMAT_OPTIONS, WRAP_TYPE_OPTIONS,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import selzy from "../../selzy.app.mjs";

export default {
  key: "selzy-create-email-message",
  name: "Create Email Message",
  description: "Adds a new email message. [See the documentation](https://selzy.com/en/support/category/api/messages/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    selzy,
    senderName: {
      type: "string",
      label: "Sender's name",
      description: "It is a string that does not match the email address (the sender_email argument).",
    },
    senderEmail: {
      type: "string",
      label: "Sender's email address",
      description: "This email must be checked (to do this, you need to manually create at least one email with this return address via the web interface, then click on the \"send the confirmation request\" link and follow the link from the email).",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "String with the letter subject. It may include substitution fields. If you wish to use substitution fields, specify a string within a Pipedream Custom Expression and escape the curly brackets with a backslash. For example: `{{ \"Welcome to Our Newsletter, \\{\\{Name\\}\\}!\" }}`. The parameter is optional if Template Id is indicated.",
    },
    body: {
      type: "string",
      label: "Body",
      description: "HTML body of the letter. It may include substitution fields. If you wish to use substitution fields, specify an HTML string within a Pipedream Custom Expression and escape the curly brackets with a backslash. For example: `{{ \"<p>Hello \\{\\{Name\\}\\},</p><p>Here is your update.</p>\" }}`.",
    },
    listId: {
      propDefinition: [
        selzy,
        "listId",
      ],
    },
    textBody: {
      type: "string",
      label: "Text Body",
      description: "Text body of the letter. It may include substitution fields. If you wish to use substitution fields, specify a text string within a Pipedream Custom Expression and escape the curly brackets with a backslash. For example: `{{ \"Hello \\{\\{Name\\}\\},\\nHere is your update.\" }}`.",
      optional: true,
    },
    generateText: {
      type: "boolean",
      label: "Generate Text",
      description: "`True` means that the text part of the letter will be generated automatically based on the HTML part. If you do not provide the text version along with the HTML version, you are recommended to set the **Generate Text** parameter to `true` for automatic generation of the text part of the letter. If the text variant of the letter is provided using the **Text Body** parameter, the **Generate Text** parameter is ignored. Thus, if the **Generate Text** value has been set to `true`, the server's response will contain a warning.",
    },
    rawBody: {
      type: "string",
      label: "Raw Body",
      description: "It is intended to save the json structure of the block editor data structure (if the value is **Message Format** = block) The parameter obtains only the JSON structure, otherwise it will not be transferred.",
      optional: true,
    },
    messageFormat: {
      type: "string",
      label: "Message Format",
      description: `It defines the manner of creating a letter.
        \n 1 - If you transfer the \`text\` value in this parameter and both the body and **Text Body** parameters are filled, the body parameter will be ignored, and the letter will be created from the data, transferred in the **Text Body** parameter.
        \n 2 - If you transfer the \`block\` value in this parameter but do not specify **Raw Body**, the letter will be saved as **Raw HTML**.
        \n 3 - If you transfer the \`block\` value in this parameter, the **body** and **Raw Body** parameters must be transferred so taht you can save the message in the block editor format.`,
      options: MESSAGE_FORMAT_OPTIONS,
      optional: true,
    },
    lang: {
      type: "string",
      label: "Lang",
      description: `Two-letter language code for the string with the unsubscribe link that is added to each letter automatically.
        If it is not specified, the language code from the API URL is used.
        In addition to the string with the unsubscribe link, this language also affects the interface of the unsubscribe page. Languages en, it, ua and ru are fully supported, and in case of some other languages (da, de, es, fr, nl, pl, pt, tr), the string with a link will be translated, and the control interface will be in English.`,
      optional: true,
    },
    templateId: {
      propDefinition: [
        selzy,
        "templateId",
      ],
      optional: true,
    },
    systemTemplateId: {
      propDefinition: [
        selzy,
        "systemTemplateId",
      ],
      optional: true,
    },
    wrapType: {
      type: "string",
      label: "Wrap Type",
      description: "Alignment of the message text on the specified side. If the argument is missing, the text will not be aligned.",
      options: WRAP_TYPE_OPTIONS,
      optional: true,
    },
    categories: {
      type: "string[]",
      label: "Categories",
      description: "A list of letter categories.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.templateId && this.systemTemplateId) {
      throw new ConfigurationError("You can only use one of the Template Id or System Template Id parameters.");
    }
    const response = await this.selzy.createEmailMessage({
      $,
      params: {
        sender_name: this.senderName,
        sender_email: this.senderEmail,
        subject: this.subject,
        body: this.body,
        list_id: this.listId,

        text_body: this.textBody,
        generate_text: +this.generateText,
        raw_body: this.rawBody,
        message_format: this.messageFormat,
        lang: this.lang,
        template_id: this.templateId,
        system_template_id: this.systemTemplateId,
        wrap_type: this.wrapType,
        categories: parseObject(this.categories)?.join(","),
      },
    });

    if (response.error) throw new ConfigurationError(response.error);

    $.export("$summary", `Email message created successfully with ID ${response.result.message_id}.`);
    return response;
  },
};
