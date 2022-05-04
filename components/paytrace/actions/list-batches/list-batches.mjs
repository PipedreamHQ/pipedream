import { axios } from "@pipedream/platform"
import paytrace from '../../paytrace.app.mjs';

export default {
  name: "List Batches by Date Range",
  description: "This method can be used to export a set of batch summary details with a provided date range.  This method will return one or more batch summary records.",
  key: 'paytrace-list-batches',
  version: "0.0.4",
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
  },
  async run({ $ }) {
    const config = {
      url: "https://api.paytrace.com/v1/batches/export",
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.paytrace.$auth.oauth_access_token}`,
        'Content-Type': 'application/json'
      },
      data: {
        start_date: this.start_date,
        end_date: this.end_date
      }
    }

    return await axios($, config);
  }
}