import base from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "supabase-new-webhook-event",
  name: "New Webhook Event (Instant)",
  description: "Emit new event for every `insert`, `update`, or `delete` operation in a table. This source requires user configuration using the Supabase website. More information in the README. [Also see documentation here](https://supabase.com/docs/guides/database/webhooks#creating-a-webhook)",
  version: "0.0.7",
  type: "source",
  props: {
    ...base.props,
    http: {
      type: "$.interface.http",
    },
  },
  hooks: {
    async deploy() {
      const client = await this.supabase._client();
      const query = client
        .from(this.table)
        .select()
        .range(0, constants.HISTORICAL_EVENT_LIMIT);
      const { data } = await query;
      for (const row of data) {
        this.$emit({
          record: row,
        }, {
          summary: "Historical row in table",
        });
      }
    },
  },
  async run(event) {
    const { body: data } = event;
    let summary = `New ${data.type} event in table`;
    if (data.record?.[this.rowIdentifier]) {
      summary = `${summary}: ${data.record[this.rowIdentifier]}`;
    }
    this.$emit(data, {
      summary,
    });
  },
};
