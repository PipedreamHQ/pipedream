import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-list-marketing-emails",
  name: "List Marketing Emails",
  description: "Retrieves a list of marketing emails. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/emails/marketing-emails#get-%2Fmarketing%2Fv3%2Femails%2F)",
  version: "0.0.8",
  type: "action",
  props: {
    hubspot,
    createdAt: {
      type: "string",
      label: "Created At",
      description:
        "Only return Marketing Emails created at exactly the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
      optional: true,
    },
    createdAfter: {
      type: "string",
      label: "Created After",
      description:
        "Only return Marketing Emails created after the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
      optional: true,
    },
    createdBefore: {
      type: "string",
      label: "Created Before",
      description:
        "Only return Marketing Emails created before the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
      optional: true,
    },
    updatedAt: {
      type: "string",
      label: "Updated At",
      description:
        "Only return Marketing Emails updated at exactly the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
      optional: true,
    },
    updatedAfter: {
      type: "string",
      label: "Updated After",
      description:
        "Only return Marketing Emails updated after the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
      optional: true,
    },
    updatedBefore: {
      type: "string",
      label: "Updated Before",
      description:
        "Only return Marketing Emails updated before the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
      optional: true,
    },
    includeStats: {
      type: "boolean",
      label: "Include Stats",
      description: "Include statistics with emails",
      optional: true,
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Specifies whether to return deleted Marketing Emails",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort the results by the specified field",
      options: [
        "name",
        "createdAt",
        "updatedAt",
        "createdBy",
        "updatedBy",
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
    const emails = [];
    let hasMore,
      count = 0;

    const params = {
      createdAt: this.createdAt,
      createdAfter: this.createdAfter,
      createdBefore: this.createdBefore,
      updatedAt: this.updatedAt,
      updatedAfter: this.updatedAfter,
      updatedBefore: this.updatedBefore,
      includeStats: this.includeStats,
      archived: this.archived,
      sort: this.sort,
    };

    do {
      const {
        paging, results,
      } = await this.hubspot.listMarketingEmails({
        $,
        params,
      });
      if (!results?.length) {
        break;
      }
      for (const item of results) {
        emails.push(item);
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
      `Found ${emails.length} email${emails.length === 1
        ? ""
        : "s"}`,
    );
    return emails;
  },
};
