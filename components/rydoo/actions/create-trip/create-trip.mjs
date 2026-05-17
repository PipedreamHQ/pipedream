import { parseObject } from "../../common/utils.mjs";
import rydoo from "../../rydoo.app.mjs";

export default {
  key: "rydoo-create-trip",
  name: "Create Trip",
  description: "Registers a new business trip for a specific user. [See the documentation](https://developers.rydoo.com/reference/v2tripsaddtrip)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    rydoo,
    userId: {
      propDefinition: [
        rydoo,
        "userId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the trip",
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Additional notes or details about the trip",
      optional: true,
    },
    isActive: {
      type: "boolean",
      label: "Is Active",
      description: "Whether the trip is currently active. Defaults to `true`",
      optional: true,
    },
    refId: {
      type: "string",
      label: "Reference ID",
      description: "External reference identifier for the trip",
      optional: true,
    },
    submitForApproval: {
      type: "boolean",
      label: "Submit for Approval",
      description: "When `true`, submits the trip for approval immediately. Defaults to `false`",
      optional: true,
    },
    destinations: {
      type: "string[]",
      label: "Destinations",
      description: "Trip destination details. Each entry must be a JSON object with destination properties (e.g., `{\"name\": \"Paris\", \"date\": \"2025-06-01\"}`)",
    },
    budget: {
      type: "string",
      label: "Budget",
      description: "Budget information for the trip as a JSON object (e.g., `{\"amount\": 1000, \"currencyCode\": \"EUR\"}`)",
      optional: true,
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "Custom field values for the trip. Each entry must be a JSON object with `key`, `value`, and optionally `valueCode` properties (e.g., `{\"key\": \"department\", \"value\": \"Engineering\", \"valueCode\": \"ENG\"}`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rydoo.createTrip({
      $,
      userId: this.userId,
      data: {
        name: this.name,
        comment: this.comment,
        isActive: this.isActive,
        refId: this.refId,
        submitForApproval: this.submitForApproval,
        destinations: parseObject(this.destinations),
        budget: parseObject(this.budget),
        customFields: parseObject(this.customFields),
      },
    });

    $.export("$summary", `Successfully created trip "${this.name}" for user ${this.userId}.`);
    return response;
  },
};
