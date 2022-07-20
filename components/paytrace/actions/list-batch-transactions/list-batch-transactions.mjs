import { axios } from "@pipedream/platform"
import paytrace from '../../paytrace.app.mjs';

export default {
  name: "List Batch Transactions",
  description: "This method can be used to export settled transaction details within a specific batch.  This method will return one or more transaction records.",
  key: 'paytrace-list-batch-transactions',
  version: "0.0.2",
  type: "action",
  props: {
    paytrace,
    batch_number: {
      type: "integer",
      label: "Batch Number",
      optional: false,
    }
  },
  async run({ $ }) {
    const config = {
      url: "https://api.paytrace.com/v1/batches/transaction_list",
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.paytrace.$auth.oauth_access_token}`,
        'Content-Type': 'application/json'
      },
      data: {
        batchNumber: this.batch_number
      }
    }

    return await axios($, config);
  }
}