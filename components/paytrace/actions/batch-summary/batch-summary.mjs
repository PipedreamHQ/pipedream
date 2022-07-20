import { axios } from "@pipedream/platform"
import paytrace from '../../paytrace.app.mjs';

export default {
  name: "Batch Summary",
  description: "This method can be used to export a summary of specific batch details or currently pending settlement details by card and transaction type.  If no optional parameter is provided, the latest batch details will be returned.",
  key: 'paytrace-batch-summary',
  version: "0.0.2",
  type: "action",
  props: {
    paytrace,
    batch_number: {
      type: "integer",
      label: "Batch Number",
      optional: true,
    }
  },
  async run({ $ }) {
    const data = {
      batchNumber: this.batch_number
    };

    const config = {
      url: "https://api.paytrace.com/v1/batches/export_one",
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.paytrace.$auth.oauth_access_token}`,
        'Content-Type': 'application/json'
      },
      data,
    }

    return await axios($, config);
  }
}