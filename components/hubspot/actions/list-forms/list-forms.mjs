import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-list-forms",
  name: "List Forms",
  description:
    "Retrieves a list of forms. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/forms#get-%2Fmarketing%2Fv3%2Fforms%2F)",
  version: "0.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hubspot,
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Whether to return only results that have been archived",
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
    const forms = [];
    let hasMore,
      count = 0;

    const params = {
      archived: this.archived,
    };

    do {
      const {
        paging, results,
      } = await this.hubspot.listMarketingForms({
        $,
        params,
      });
      if (!results?.length) {
        break;
      }
      for (const item of results) {
        forms.push(item);
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
      `Found ${forms.length} form${forms.length === 1
        ? ""
        : "s"}`,
    );
    return forms;
  },
};
