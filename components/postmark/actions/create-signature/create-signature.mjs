import postmark from "../../postmark.app.mjs";

export default {
  key: "postmark-create-signature",
  name: "Create Sender Signature",
  description: "Create a new sender signature. [See the documentation](https://postmarkapp.com/developer/api/signatures-api#create-signature)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    postmark,
    fromEmail: {
      type: "string",
      label: "From Email",
      description: "From email associated with sender signature.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "From name associated with sender signature.",
    },
    replyToEmail: {
      type: "string",
      label: "Reply To Email",
      description: "Override for reply-to address.",
      optional: true,
    },
    returnPathDomain: {
      type: "string",
      label: "Return Path Domain",
      description: "A custom value for the Return-Path domain. It is an optional field, but it must be a subdomain of your From Email domain and must have a CNAME record that points to **pm.mtasv.net**. For more information about this field, please [read our support page](http://support.postmarkapp.com/article/910-adding-a-custom-return-path-domain).",
      optional: true,
    },
    confirmationPersonalNote: {
      type: "string",
      label: "Confirmation Personal Note",
      description: "A way to provide a note to the recipient of the confirmation email to have context of what Postmark is. Max length of 400 characters.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.postmark.createSignature({
      $,
      data: {
        FromEmail: this.fromEmail,
        Name: this.name,
        ReplyToEmail: this.replyToEmail,
        ReturnPathDomain: this.returnPathDomain,
        ConfirmationPersonalNote: this.confirmationPersonalNote,
      },
    });

    $.export("$summary", `The new signature with ID: ${response.ID} was successfully created!`);
    return response;
  },
};
