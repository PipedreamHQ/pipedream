import convertkit from "../../convertkit.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "convertkit-list-subscribers",
  name: "List subscribers",
  description: "Returns a list of your subscribers. [See docs here](https://developers.convertkit.com/#list-subscribers)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    convertkit,
    emailAddress: {
      label: "Email address",
      description: "Search subscribers by email address",
      type: "string",
      optional: true,
    },
    page: {
      label: "Page",
      description: "Page for paginated results",
      type: "integer",
      default: 1,
      optional: true,
    },
    from: {
      label: "Start date",
      description: "Filter subscribers added on or after this date (format yyyy-mm-dd)",
      type: "string",
      optional: true,
    },
    to: {
      label: "End date",
      description: "Filter subscribers added on or before this date (format yyyy-mm-dd)",
      type: "string",
      optional: true,
    },
    sortOrder: {
      label: "Sort order",
      description: "Sort order for results",
      type: "string",
      default: constants.SORT_ORDER[0],
      options: constants.SORT_ORDER,
      optional: true,
    },
  },
  async run({ $ }) {
    const payload = {
      email_address: this.emailAddress,
      page: this.page,
      from: this.from,
      to: this.to,
      sort_order: this.sortOrder,
    };
    const data = [];
    const paginator = this.convertkit.paginate({
      $,
      fn: this.convertkit.listSubscribers,
      payload,
    }, "subscribers");
    for await (const item of paginator) {
      data.push(item);
    }
    if (data.length) {
      $.export("$summary", "Successfully listed subscribers");
    }
    return data;
  },
};
