import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-list-blog-posts",
  name: "List Blog Posts",
  description: "Retrieves a list of blog posts. [See the documentation](https://developers.hubspot.com/docs/reference/api/cms/blogs/blog-posts)",
  version: "0.0.3",
  type: "action",
  props: {
    hubspot,
    createdAt: {
      type: "string",
      label: "Created At",
      description: "Only return Blog Posts created at exactly the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
      optional: true,
    },
    createdAfter: {
      type: "string",
      label: "Created After",
      description: "Only return Blog Posts created after the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
      optional: true,
    },
    createdBefore: {
      type: "string",
      label: "Created Before",
      description: "Only return Blog Posts created before the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
      optional: true,
    },
    updatedAt: {
      type: "string",
      label: "Updated At",
      description: "Only return Blog Posts updated at exactly the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
      optional: true,
    },
    updatedAfter: {
      type: "string",
      label: "Updated After",
      description: "Only return Blog Posts updated after the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
      optional: true,
    },
    updatedBefore: {
      type: "string",
      label: "Updated Before",
      description: "Only return Blog Posts updated before the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
      optional: true,
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Specifies whether to return deleted Blog Posts",
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
    const results = [];
    let hasMore, count = 0;

    const params = {
      createdAt: this.createdAt,
      createdAfter: this.createdAfter,
      createdBefore: this.createdBefore,
      updatedAt: this.updatedAt,
      updatedAfter: this.updatedAfter,
      updatedBefore: this.updatedBefore,
      archived: this.archived,
      sort: this.sort,
    };

    do {
      const {
        paging, results,
      } = await this.hubspot.getBlogPosts({
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

    $.export("$summary", `Found ${results.length} page${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
