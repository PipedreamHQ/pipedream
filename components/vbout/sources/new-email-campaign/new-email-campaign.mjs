import moment from "moment";
import common from "../common/base.mjs";

export default {
  ...common,
  type: "source",
  name: "New Email Campaign",
  key: "vbout-new-email-campaign",
  description: "Emit new event for each new email campaign. [See docs here](https://developers.vbout.com/docs#emailmarketing_campaigns)",
  version: "0.0.4",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getDataToEmit({ id }) {
      const ts = new Date().getTime();
      return {
        id,
        summary: `New Email Campaign (${id})`,
        ts,
      };
    },
    getDatetimeField() {
      return "creation_date";
    },
    getItemDate(datetime) {
      return moment(datetime)
        .format("YYYY-MM-DD");
    },
    getLastDate(itemDate) {
      return moment(itemDate).subtract(1, "day")
        .format("YYYY-MM-DD");
    },
    async getRecords(params) {
      const toEmit = [];
      const records = this.vbout.paginate({
        fn: this.vbout.getCampaigns,
        params,
        field: "campaigns",
      });
      for await (const record of records) {
        toEmit.push(record);
      }
      return toEmit;
    },
    async getItems() {
      const { campaigns } = await this.vbout.getCampaigns({
        limit: 20,
        filter: "all",
      });
      return campaigns;
    },
    getParams({ lastDatetime }) {
      return {
        limit: 99999999,
        filter: "all",
        from: lastDatetime,
      };
    },
  },
};
