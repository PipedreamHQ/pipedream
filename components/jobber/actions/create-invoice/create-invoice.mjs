import jobber from "../../jobber.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "jobber-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice within Jobber. [See the documentation](https://developer.getjobber.com/docs/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    jobber,
    clientId: {
      propDefinition: [
        jobber,
        "clientId",
      ],
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the invoice",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "Message to display on the invoice",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      clientId,
      subject,
      message,
    } = this;

    const input = [
      `clientId: "${clientId}"`,
      subject && `subject: "${subject}"`,
      message && `message: "${message}"`,
    ].filter(Boolean).join(", ");

    const response = await this.jobber.post({
      $,
      data: {
        query: `mutation CreateInvoice {
          invoiceCreate(input: {${input}}) {
            invoice {
              id
              invoiceNumber
            }
            userErrors {
              message
            }
          }
        }`,
        operationName: "CreateInvoice",
      },
    });
    if (response.errors) {
      throw new Error(response.errors[0].message);
    }
    const userErrors = response.data?.invoiceCreate?.userErrors;
    if (userErrors?.length) {
      throw new ConfigurationError(userErrors[0].message);
    }
    $.export("$summary", `Successfully created invoice with ID ${response.data.invoiceCreate.invoice.id}`);
    return response;
  },
};
