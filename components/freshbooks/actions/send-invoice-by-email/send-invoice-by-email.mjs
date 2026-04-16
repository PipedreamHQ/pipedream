import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import freshbooks from "../../freshbooks.app.mjs";

export default {
  key: "freshbooks-send-invoice-by-email",
  name: "Send Invoice By Email",
  description: "Send an existing invoice by email to one or more recipients. [See the documentation](https://www.freshbooks.com/api/invoices)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    freshbooks,
    accountId: {
      propDefinition: [
        freshbooks,
        "accountId",
      ],
    },
    invoiceId: {
      propDefinition: [
        freshbooks,
        "invoiceId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
    },
    emailRecipients: {
      type: "string[]",
      label: "Email Recipients",
      description: "List of email addresses to send the invoice to",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the email",
      optional: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "The body of the email",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      freshbooks,
      accountId,
      invoiceId,
      emailRecipients,
      subject,
      body,
    } = this;

    const invoiceCustomizedEmail = {};
    if (subject) invoiceCustomizedEmail.subject = subject;
    if (body) invoiceCustomizedEmail.body = body;

    const recipients = parseObject(emailRecipients)?.map((email) => email.trim());
    if (!recipients?.length) {
      throw new ConfigurationError("`Email Recipients` must not be empty");
    }

    const result = await freshbooks.sendInvoiceByEmail({
      $,
      accountId,
      invoiceId,
      data: {
        email_recipients: recipients,
        ...(Object.keys(invoiceCustomizedEmail).length
          ? {
            invoice_customized_email: invoiceCustomizedEmail,
          }
          : {}),
      },
    });
    $.export("$summary", `Successfully sent invoice to ${recipients.length} recipient(s)`);
    return result;
  },
};
