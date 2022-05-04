import { axios } from "@pipedream/platform"
import paytrace from '../../paytrace.app.mjs';

export default {
  name: "List Transactions",
  description: "This method can be used to export a set of credit card transaction details with a provided date range.  You can optimize your search by providing optional parameters.",
  key: 'paytrace-list-transactions',
  version: "0.0.2",
  type: "action",
  props: {
    paytrace,
    start_date: {
      type: "string",
      label: "Start Date",
      description: "Start date formatted MM/DD/YYYY",
      optional: false,
    },
    end_date: {
      type: "string",
      label: "Start Date",
      description: "Start date formatted MM/DD/YYYY",
      optional: false,
    },
    transaction_id: {
      type: "string",
      label: "Transaction ID",
      description: "A unique identifier for each transaction in the PayTrace system.",
      optional: true,
    },
    transaction_type: {
      type: "string",
      label: "Transaction Type",
      description: "The transaction type to find transactions.",
      optional: true,
      options: ["SALE", "AUTHORIZATION", "STR/FWD", "REFUND", "VOID", "SETTLED", "PENDING", "DECLINED"],
    },
    customer_id: {
      type: "string",
      label: "Customer ID",
      description: "A unique identifier for an existing customer profile stored in your Customer Database (Vault) at PayTrace.",
      optional: true,
    },
    include_bin: {
      type: "boolean",
      label: "Include BIN",
      description: "If set to true, this will return the first 6 and last 4 digits of the card number.",
      optional: true,
    },
    including_text: {
      type: "string",
      label: "Search Text",
      description: "The text submitted will be used to locate transactions containing this text. This will help to narrow down the export results.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      start_date: this.start_date,
      end_date: this.end_date,
      transaction_id: this.transaction_id,
      transaction_type: this.transaction_type,
      customer_id: this.customer_id,
      include_bin: this.include_bin,
      including_text: this.including_text,
    };
    const config = {
      url: "https://api.paytrace.com/v1/transactions/export/by_date_range",
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.paytrace.$auth.oauth_access_token}`,
        'Content-Type': 'application/json'
      },
      data
    }

    return await axios($, config);
  }
}