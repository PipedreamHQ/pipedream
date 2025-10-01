import app from "../../metabase.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "metabase-create-dashboard",
  name: "Create Dashboard",
  description: "Create a new Dashboard. [See the documentation](https://www.metabase.com/docs/latest/api#tag/apidashboard/post/api/dashboard/).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the dashboard",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the dashboard",
      optional: true,
    },
    collectionId: {
      propDefinition: [
        app,
        "collectionId",
      ],
      optional: true,
    },
    collectionPosition: {
      type: "integer",
      label: "Collection Position",
      description: "Position within the collection (must be greater than zero)",
      min: 1,
      optional: true,
    },
    cacheTtl: {
      type: "integer",
      label: "Cache TTL",
      description: "Cache time-to-live in seconds (must be greater than zero)",
      min: 1,
      optional: true,
    },
    parameters: {
      type: "string[]",
      label: "Parameters",
      description: "Array of parameter definition objects.\n\n**Required properties:**\n- `id` (string) - Parameter identifier\n- `type` (string) - Parameter type (e.g., \"date/single\", \"text\", \"category\")\n\n**Optional properties:**\n- `name` (string) - Display name\n- `slug` (string) - URL-friendly identifier\n- `sectionId` (string) - Section grouping\n- `default` - Default value\n- `values_source_type` (enum) - \"static-list\", \"card\", or null\n- `values_source_config` (object) - Dynamic value configuration with `card_id`, `label_field`, `value_field`, `values`\n- `temporal_units` (array) - Time-based parameter units\n\n**Example:** `{\"id\": \"date_param\", \"type\": \"date/single\", \"name\": \"Date Filter\", \"slug\": \"date_filter\", \"default\": \"2024-01-01\"}`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      name,
      description,
      collectionId,
      collectionPosition,
      cacheTtl,
      parameters,
    } = this;

    const response = await app.createDashboard({
      $,
      data: {
        name,
        description,
        collection_id: collectionId,
        collection_position: collectionPosition,
        cache_ttl: cacheTtl,
        parameters: utils.parseArray(parameters),
      },
    });

    $.export("$summary", `Successfully created dashboard with ID \`${response?.id}\``);

    return response;
  },
};
