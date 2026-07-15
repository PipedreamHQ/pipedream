import app from "../../eppo.app.mjs";

export default {
  key: "eppo-create-feature-flag",
  name: "Create Feature Flag",
  description:
    "Create a new feature flag in Eppo with a unique key, display name, entity ID, variations, and optional tags."
    + " Use this when the user wants to add a new feature flag."
    + " The `key` must be a unique URL-safe slug (e.g. `my-new-feature`). Duplicate keys are rejected by the API."
    + " IMPORTANT: Each variation requires `variant_key` (unique slug) and `type` (must be `STRING`, `INTEGER`, or `JSON` — uppercase). Do NOT use `key` or `value` fields."
    + " Example: `[{\"variant_key\": \"on\", \"type\": \"STRING\", \"name\": \"On\"}, {\"variant_key\": \"off\", \"type\": \"STRING\", \"name\": \"Off\"}]`."
    + " Use **List Feature Flags** to verify the flag was created."
    + " [See the documentation](https://eppo.cloud/api/docs#/FeatureFlags/createFeatureFlag)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    key: {
      type: "string",
      label: "Key",
      description: "A unique URL-safe slug for the flag (e.g. `my-new-feature`). Must be unique across all flags.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "A human-readable display name for the flag.",
    },
    variations: {
      type: "string",
      label: "Variations",
      description: "JSON array of variation objects. Each requires `variant_key` (unique slug) and `type` (uppercase: `STRING`, `INTEGER`, or `JSON`). Do NOT use `key` or `value` fields — use `variant_key` and `type`. Optionally include `name`."
        + " Example: `[{\"variant_key\": \"on\", \"type\": \"STRING\", \"name\": \"On\"}, {\"variant_key\": \"off\", \"type\": \"STRING\", \"name\": \"Off\"}]`.",
    },
    entityId: {
      propDefinition: [
        app,
        "entityId",
      ],
    },
    tagNames: {
      type: "string[]",
      label: "Tag Names",
      description: "The names of the tags to add to the flag. Example: `[\"growth\", \"checkout\"]`.",
    },
  },
  async run({ $ }) {
    const variations = JSON.parse(this.variations);
    const response = await this.app.createFeatureFlag({
      $,
      data: {
        key: this.key,
        name: this.name,
        variations,
        entity_id: this.entityId,
        tag_names: this.tagNames,
      },
    });
    $.export("$summary", `Created feature flag ${response?.id}: ${response?.name ?? this.name}`);
    return response;
  },
};
