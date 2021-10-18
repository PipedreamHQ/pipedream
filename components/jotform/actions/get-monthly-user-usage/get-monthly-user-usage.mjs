import common from "../common.mjs";

export default {
  ...common,
  key: "jotform-get-monthly-user-usage",
  name: "Get Monthly User Usage",
  description: `Gets number of form submissions received this month. Also, get number of SSL form 
    submissions, payment form submissions and upload space used by user`,
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    http: "$.interface.http",
  },
  async run() {
    return (await this.jotform.getUserUsage()).content;
  },
};
