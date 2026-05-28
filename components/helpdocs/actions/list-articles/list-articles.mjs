import helpdocs from "../../helpdocs.app.mjs";

export default {
  key: "helpdocs-list-articles",
  name: "List Articles",
  description: "Retrieve a list of articles from your HelpDocs knowledge base. [See the documentation](https://apidocs.helpdocs.io/article/OqvaxRMHgN-getting-articles)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    helpdocs,
    categoryId: {
      propDefinition: [
        helpdocs,
        "categoryId",
      ],
      optional: true,
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "Filter articles by tag",
      optional: true,
    },
    includeBody: {
      type: "boolean",
      label: "Include Body",
      description: "Include the HTML `body` field of each article",
      optional: true,
    },
    permissionGroupId: {
      propDefinition: [
        helpdocs,
        "groupId",
      ],
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter articles by status",
      options: [
        "published",
        "draft",
        "private",
      ],
      optional: true,
    },
    isStale: {
      type: "boolean",
      label: "Is Stale",
      description: "Restrict returned articles based on whether they are set as Stale or not",
      optional: true,
    },
    needsTranslation: {
      type: "boolean",
      label: "Needs Translation",
      description: "Restrict returned articles based on whether they are marked as Needs Translation",
      optional: true,
    },
    languageCode: {
      type: "string",
      label: "Language Code",
      description: "Restrict returned articles based on language code (e.g. `en`, `fr`, etc.)",
      optional: true,
    },
    updatedAtBefore: {
      type: "string",
      label: "Updated At Before",
      description: "Restrict returned articles based on whether they were published before a certain date. E.g. `2025-01-01`",
      optional: true,
    },
    updatedAtAfter: {
      type: "string",
      label: "Updated At After",
      description: "Restrict returned articles based on whether they were published after a certain date. E.g. `2025-01-01`",
      optional: true,
    },
    workingCopy: {
      type: "boolean",
      label: "Working Copy",
      description: "Returns the latest rather than currently published versions",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of articles to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const results = this.helpdocs.paginate({
      fn: this.helpdocs.listArticles,
      params: {
        category_id: this.categoryId,
        tag: this.tag,
        include_body: this.includeBody,
        permission_group_id: this.permissionGroupId,
        status: this.status,
        is_stale: this.isStale,
        needs_translation: this.needsTranslation,
        language_code: this.languageCode,
        updated_at_before: this.updatedAtBefore,
        updated_at_after: this.updatedAtAfter,
        working_copy: this.workingCopy,
      },
      resourceKey: "articles",
      max: this.maxResults,
    });

    const articles = [];
    for await (const article of results) {
      articles.push(article);
    }

    $.export("$summary", `Found ${articles.length} articles`);
    return articles;
  },
};
