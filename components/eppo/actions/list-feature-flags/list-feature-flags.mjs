import app from "../../eppo.app.mjs";

export default {
  key: "eppo-list-feature-flags",
  name: "List Feature Flags",
  description:
    "Retrieve all feature flags in Eppo with their name, key, enabled status, and allocation configuration."
    + " Use this tool when a user wants to see all flags, find a specific flag by name, or discover flag IDs needed by **Get Feature Flag** or **Toggle Feature Flag**."
    + " Filter by `enabled` to list only active or inactive flags. Set `includeArchived` to also return archived flags."
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
    enabled: {
      type: "boolean",
      label: "Enabled",
      description: "Filter to only enabled (`true`) or disabled (`false`) flags. Omit to return all flags.",
      optional: true,
    },
    includeArchived: {
      type: "boolean",
      label: "Include Archived",
      description: "Set to `true` to include archived flags in the results. Defaults to `false`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listFeatureFlags({
      $,
      enabled: this.enabled,
      includeArchived: this.includeArchived,
    });
    const flags = response?.flags ?? response ?? [];
    $.export("$summary", `Retrieved ${flags.length} feature flag(s)`);
    return flags;
  },
};
