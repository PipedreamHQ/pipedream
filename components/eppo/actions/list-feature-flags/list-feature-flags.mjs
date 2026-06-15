import app from "../../eppo.app.mjs";

export default {
  key: "eppo-list-feature-flags",
  name: "List Feature Flags",
  description:
    "Retrieve all feature flags in Eppo with their name, key, enabled status, and allocation configuration."
    + " Use this tool when a user wants to see all flags, find a specific flag by name, or discover flag IDs needed by **Get Feature Flag** or **Toggle Feature Flag**."
    + " Set `includeArchived` to also return archived flags."
    + " [See the documentation](https://eppo.cloud/api/docs#/FeatureFlags/getFeatureFlags)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    includeArchived: {
      type: "boolean",
      label: "Include Archived",
      description: "Set to `true` to include archived flags in the results. Defaults to `false`.",
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listFeatureFlags({
      $,
      params: {
        include_archived: this.includeArchived,
        limit: this.limit,
        offset: this.offset,
      },
    });
    const flags = response?.flags ?? response ?? [];
    $.export("$summary", `Retrieved ${flags.length} feature flag(s)`);
    return flags;
  },
};
