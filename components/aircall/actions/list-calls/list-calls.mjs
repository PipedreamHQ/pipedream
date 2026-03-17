import aircall from "../../aircall.app.mjs";
import { parseDate } from "../../common/utils.mjs";

export default {
  key: "aircall-list-calls",
  name: "List Calls",
  description: "List calls. [See the documentation](https://developer.aircall.io/api-references/#list-all-calls)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    aircall,
    from: {
      propDefinition: [
        aircall,
        "from",
      ],
    },
    to: {
      propDefinition: [
        aircall,
        "to",
      ],
    },
    order: {
      propDefinition: [
        aircall,
        "order",
      ],
    },
    maxResults: {
      propDefinition: [
        aircall,
        "maxResults",
      ],
    },
    fetchContact: {
      type: "boolean",
      label: "Fetch Contact",
      description: "When set to `true`, adds contacts details in response",
      optional: true,
    },
    fetchShortUrls: {
      type: "boolean",
      label: "Fetch Short URLs",
      description: "When set to `true`, adds short URLs in response",
      optional: true,
    },
    fetchCallTimeline: {
      type: "boolean",
      label: "Fetch Call Timeline",
      description: "When set to true, it will [ivr_options_selected](https://developer.aircall.io/api-references/#ivr-option) at the same level of the call",
      optional: true,
    },
  },
  async run({ $ }) {
    const results = this.aircall.paginate({
      fn: this.aircall.listCalls,
      args: {
        $,
        params: {
          from: parseDate(this.from),
          to: parseDate(this.to),
          order: this.order,
          fetch_contact: this.fetchContact,
          fetch_short_urls: this.fetchShortUrls,
          fetch_call_timeline: this.fetchCallTimeline,
        },
      },
      resourceKey: "calls",
      max: this.maxResults,
    });

    const calls = [];
    for await (const call of results) {
      calls.push(call);
    }

    if (calls?.length) {
      $.export("$summary", `Successfully retrieved ${calls.length} call${calls.length === 1
        ? ""
        : "s"}`);
    } else {
      $.export("$summary", "No calls found");
    }
    return calls;
  },
};
