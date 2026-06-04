import { getFileStream } from "@pipedream/platform";
import FormData from "form-data";
import app from "../../deel.app.mjs";

export default {
  key: "deel-create-adjustment",
  name: "Create Adjustment",
  description:
    "Create a payroll line-item adjustment for an EOR or GP contract in Deel (bonus, deduction, expense, etc.)."
    + " This uses multipart/form-data and supports an optional file attachment (e.g., a receipt)."
    + " `country` must be an ISO 3166-1 alpha-2 code (e.g., `US`, `DE`)."
    + " `adjustment_category_id` is required — retrieve valid category IDs from `GET /adjustments/categories`"
    + " or ask your Deel administrator."
    + " Use **List Contracts** to find the contract ID."
    + " [See the documentation](https://developer.deel.com/docs/create-an-adjustment)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    contractId: {
      propDefinition: [
        app,
        "contractId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "A title/name for this adjustment (e.g., `Expense Reimbursement`).",
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The adjustment amount (e.g., `250`).",
    },
    vendor: {
      type: "string",
      label: "Vendor",
      description: "The vendor or payee name (e.g., `Office Supplies Co`).",
    },
    country: {
      propDefinition: [
        app,
        "countryCode",
      ],
      description: "ISO 3166-1 alpha-2 country code where the adjustment applies (e.g., `US`, `DE`).",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the adjustment.",
    },
    adjustmentCategoryId: {
      type: "string",
      label: "Adjustment Category ID",
      description: "The ID of the adjustment category. Retrieve valid IDs via `GET /adjustments/categories` or ask your Deel administrator.",
    },
    dateOfAdjustment: {
      type: "string",
      label: "Date of Adjustment",
      description: "The date of the adjustment in ISO 8601 format (e.g., `2026-07-01`).",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Attachment",
      description: "Optional file attachment (e.g., receipt). Provide a file URL or a path in the /tmp directory (e.g., `/tmp/receipt.pdf`).",
      format: "file-ref",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const form = new FormData();
    form.append("contract_id", this.contractId);
    form.append("title", this.title);
    form.append("amount", this.amount);
    form.append("vendor", this.vendor);
    form.append("country", this.country);
    form.append("description", this.description);
    form.append("adjustment_category_id", this.adjustmentCategoryId);
    if (this.dateOfAdjustment) form.append("date_of_adjustment", this.dateOfAdjustment);

    if (this.filePath) {
      const fileStream = await getFileStream(this.filePath);
      const filename = this.filePath.split("/").pop() || "attachment";
      form.append("file", fileStream, {
        filename,
      });
    }

    const response = await this.app.createAdjustment($, form);

    const adj = response?.data ?? response;
    const adjId = adj?.id ?? "unknown";
    $.export("$summary", `Created adjustment ${adjId}: ${this.title} (${this.amount}) for contract ${this.contractId}`);
    return response;
  },
};
