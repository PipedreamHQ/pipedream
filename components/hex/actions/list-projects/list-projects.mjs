import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import hex from "../../hex.app.mjs";

export default {
  key: "hex-list-projects",
  name: "List Projects",
  description: "List all viewable projects. [See the documentation](https://learn.hex.tech/docs/api/api-reference#operation/ListProjects)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hex,
    includeArchived: {
      type: "boolean",
      label: "Include Archived",
      description: "Whether to include archived projects in the results.",
      optional: true,
    },
    includeComponents: {
      type: "boolean",
      label: "Include Components",
      description: "Whether to include components in the results.",
      optional: true,
    },
    includeTrashed: {
      type: "boolean",
      label: "Include Trashed",
      description: "Whether to include trashed projects in the results.",
      optional: true,
    },
    includeSharing: {
      type: "boolean",
      label: "Include Sharing",
      description: "Whether to include sharing information in the results.",
      optional: true,
    },
    statuses: {
      type: "string[]",
      label: "Statuses",
      description: "The statuses to filter the projects by.",
      optional: true,
    },
    categories: {
      type: "string[]",
      label: "Categories",
      description: "The categories to filter the projects by.",
      optional: true,
    },
    creatorEmail: {
      type: "string",
      label: "Creator Email",
      description: "The email of the creator of the projects.",
      optional: true,
    },
    ownerEmail: {
      type: "string",
      label: "Owner Email",
      description: "The email of the owner of the projects.",
      optional: true,
    },
    collectionId: {
      type: "string",
      label: "Collection ID",
      description: "The ID of the collection of the projects.",
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "The field to sort the projects by.",
      optional: true,
      options: [
        "CREATED_AT",
        "LAST_EDITED_AT",
        "LAST_PUBLISHED_AT",
      ],
    },
    sortDirection: {
      type: "string",
      label: "Sort Direction",
      description: "The direction to sort the projects by.",
      optional: true,
      options: [
        "ASC",
        "DESC",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return.",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = this.hex.paginate({
        $,
        maxResults: this.maxResults,
        fn: this.hex.listProjects,
        params: {
          limit: 1,
          includeArchived: this.includeArchived,
          includeComponents: this.includeComponents,
          includeTrashed: this.includeTrashed,
          includeSharing: this.includeSharing,
          statuses: this.statuses && parseObject(this.statuses),
          categories: this.categories && parseObject(this.categories),
          creatorEmail: this.creatorEmail,
          ownerEmail: this.ownerEmail,
          collectionId: this.collectionId,
          sortBy: this.sortBy,
          sortDirection: this.sortDirection,
        },
      });

      const results = [];
      for await (const project of response) {
        results.push(project);
      }

      $.export("$summary", `Successfully listed ${results.length} project${results.length === 1
        ? ""
        : "s"}`);

      return results;
    } catch ({ response }) {
      throw new ConfigurationError(response.data.reason);
    }
  },
};
