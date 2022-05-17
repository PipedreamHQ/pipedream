// legacy_hash_id: a_52idkj
import AWS from "aws-sdk";

export default {
  key: "amazon_ses-send-an-email",
  name: "Send an Email",
  description: "Send an email using Amazon SES",
  version: "0.8.2",
  type: "action",
  props: {
    amazon_ses: {
      type: "app",
      app: "amazon_ses",
    },
    region: {
      type: "string",
      label: "Region",
      description: "The AWS region tied to your SES identity",
    },
    CcAddresses: {
      type: "string[]",
      label: "CC Addresses",
      description: "An array of email addresses you want to CC",
      optional: true,
    },
    BccAddresses: {
      type: "string[]",
      label: "BCC Addresses",
      description: "An array of email addresses you want to BCC",
      optional: true,
    },
    ToAddresses: {
      type: "string[]",
      label: "To Addresses",
      description: "An array of email addresses you want to send email to",
    },
    ReplyToAddresses: {
      type: "string[]",
      label: "Reply To Addresses",
      description: "An array of Reply-To addresses",
      optional: true,
    },
    html: {
      type: "string",
      label: "HTML",
      description: "HTML email body",
      optional: true,
    },
    text: {
      type: "string",
      description: "Plaintext email body",
    },
    subject: {
      type: "string",
      description: "Email subject",
    },
    Source: {
      type: "string",
      label: "From",
      description: "The email from which the email is addressed",
    },
  },
  async run({ $ }) {
    const {
      accessKeyId,
      secretAccessKey,
    } = this.amazon_ses.$auth;

    const ses = new AWS.SES({
      accessKeyId,
      secretAccessKey,
      region: this.region,
    });

    const {
      CcAddresses,
      BccAddresses,
      ToAddresses,
      ReplyToAddresses,
      html,
      text,
      subject,
      Source,
    } = this;
    const sesParams = {
      Destination: {
        CcAddresses,
        BccAddresses,
        ToAddresses,
      },
      Message: {
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: text,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
      },
      ReplyToAddresses,
      Source,
    };

    if (html) {
      sesParams.Message.Body.Html = {
        Charset: "UTF-8",
        Data: html,
      };
    }

    $.export("resp", await ses.sendEmail(sesParams).promise());
  },
};
