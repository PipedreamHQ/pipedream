import moment from "moment";
import common from "../common/base.mjs";

export default {
  ...common,
  type: "source",
  name: "New Social Media Message",
  key: "vbout-new-social-media-message",
  description: "Emit new event for each new social media message. [See docs here](https://api.vbout.com/1/socialmedia/stats)",
  version: "0.0.4",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getDataToEmit({
      id, channel: { network },
    }) {
      const ts = new Date().getTime();
      return {
        id,
        summary: `New ${network} Message (${id})`,
        ts,
      };
    },
    getDatetimeField() {
      return "date";
    },
    getItemDate(datetime) {
      return moment(datetime)
        .format("YYYY-MM-DD HH:mm");
    },
    getLastDate(itemDate) {
      return moment(itemDate).subtract(1, "day")
        .format("YYYY-MM-DD HH:mm");
    },
    getRecords(params) {
      return this.vbout.fetchItems({
        func: this.getItems,
        params,
      });
    },
    async getItems(params) {
      const { calendar } = await this.vbout.getCalendar(params);
      return calendar;
    },
    getParams({
      limit, lastDatetime,
    }) {
      const fromDate = lastDatetime ?? moment().subtract(1000, "year");
      return {
        from: moment(fromDate).format("YYYY-MM-DD HH:mm"),
        to: moment().add(1000, "year")
          .format("YYYY-MM-DD HH:mm"),
        limit,
        sort: "desc",
        includeposted: true,
      };
    },
  },
};
