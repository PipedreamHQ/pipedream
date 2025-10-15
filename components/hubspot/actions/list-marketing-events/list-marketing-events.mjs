import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-list-marketing-events",
  name: "List Marketing Events",
  description: "Retrieves a list of marketing events. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/marketing-events#get-%2Fmarketing%2Fv3%2Fmarketing-events%2F)",
  version: "0.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hubspot,
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const events = [];
    const params = {
      limit: 100,
    };
    let hasMore,
      count = 0;

    do {
      const {
        paging, results,
      } = await this.hubspot.listMarketingEvents({
        $,
        params,
      });
      if (!results?.length) {
        break;
      }
      for (const item of results) {
        events.push(item);
        count++;
        if (count >= this.maxResults) {
          break;
        }
      }
      hasMore = paging?.next.after;
      params.after = paging?.next.after;
    } while (hasMore && count < this.maxResults);

    $.export(
      "$summary",
      `Found ${events.length} event${events.length === 1
        ? ""
        : "s"}`,
    );
    return events;
  },
};
