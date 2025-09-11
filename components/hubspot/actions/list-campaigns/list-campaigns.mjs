import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-list-campaigns",
  name: "List Campaigns",
  description:
    "Retrieves a list of campaigns. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/campaigns#get-%2Fmarketing%2Fv3%2Fcampaigns%2F)",
  version: "0.0.7",
  type: "action",
  props: {
    hubspot,
    sort: {
      type: "string",
      label: "Sort",
      description:
        "The field by which to sort the results. An optional '-' before the property name can denote descending order",
      options: [
        "hs_name",
        "-hs_name",
        "createdAt",
        "-createdAt",
        "updatedAt",
        "-updatedAt",
      ],
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const results = [];
    let hasMore,
      count = 0;

    const params = {
      sort: this.sort,
    };

    do {
      const {
        paging, results,
      } = await this.hubspot.listCampaigns({
        $,
        params,
      });
      if (!results?.length) {
        break;
      }
      for (const item of results) {
        results.push(item);
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
      `Found ${results.length} campaign${results.length === 1
        ? ""
        : "s"}`,
    );
    return results;
  },
};
