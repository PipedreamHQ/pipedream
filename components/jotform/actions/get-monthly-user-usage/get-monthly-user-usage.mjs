import common from "../common.mjs";

export default {
  ...common,
  key: "jotform-get-monthly-user-usage",
  name: "Get Monthly User Usage",
  description: "Gets number of form submissions received this month. Also, get number of SSL form submissions, payment form submissions and upload space used by user [See the docs here](https://api.jotform.com/docs/#user-usage)",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    http: "$.interface.http",
  },
  async run({ $ }) {
    const resp = (await this.jotform.getUserUsage({
      $,
    })).content;
    $.export("$summary", "Successfully retrieved monthly user usage");
    return resp;
  },
};
