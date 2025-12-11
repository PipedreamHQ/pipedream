import { getFileStreamAndMetadata } from "@pipedream/platform";
import remote from "../../remote.app.mjs";

export default {
  key: "remote-create-expense",
  name: "Create Expense",
  description: "Create an expense in Remote. [See the documentation](https://developer.remote.com/reference/post_create_expense)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    remote,
    amount: {
      type: "integer",
      label: "Amount",
      description: "The amount of the expense",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The currency of the expense",
      options: [
        "USD",
        "EUR",
        "CAD",
      ],
    },
    employmentId: {
      propDefinition: [
        remote,
        "employmentId",
      ],
    },
    expenseCategorySlug: {
      propDefinition: [
        remote,
        "expenseCategorySlug",
        ({ employmentId }) => ({
          employmentId,
        }),
      ],
    },
    expenseDate: {
      type: "string",
      label: "Expense Date",
      description: "Date of the purchase, which must be in the past. **Format: YYYY-MM-DD**",
    },
    receiptContentFilePath: {
      type: "string",
      label: "Receipt Content File Path",
      description: "The file of the receipt. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.pdf`)",
    },
    receiptFileName: {
      type: "string",
      label: "Receipt File Name",
      description: "The file name",
    },
    reviewedAt: {
      type: "string",
      label: "Reviewed At",
      description: "The date and time that the expense was reviewed in ISO8601 format. If not provided, it defaults to the current datetime. **Format: YYYY-MM-DDTHH:MM:SS**",
    },
    taxAmount: {
      type: "integer",
      label: "Tax Amount",
      description: "The tax amount of the expense",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The timezone of the expense. [TZ identifier](https://www.iana.org/time-zones)",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the expense",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
    },
  },
  methods: {
    async streamToBase64(stream) {
      return new Promise((resolve, reject) => {
        const chunks = [];

        stream.on("data", (chunk) => {
          chunks.push(chunk);
        });

        stream.on("end", () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer.toString("base64"));
        });

        stream.on("error", (err) => {
          reject(err);
        });
      });
    },
  },
  async run({ $ }) {
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.receiptContentFilePath);
    const base64String = await this.streamToBase64(stream);

    const response = await this.remote.createExpense({
      $,
      data: {
        amount: this.amount,
        currency: this.currency,
        employment_id: this.employmentId,
        expense_date: this.expenseDate,
        title: this.title,
        receipt: {
          content: `data:${metadata.contentType};base64,${base64String}`,
          name: this.receiptFileName,
        },
        expense_category_slug: this.expenseCategorySlug,
        reviewed_at: this.reviewedAt,
        tax_amount: this.taxAmount,
        timezone: this.timezone,
      },
    });

    $.export("$summary", `Successfully created expense with ID: ${response?.data?.expense?.id}`);
    return response;
  },
};
