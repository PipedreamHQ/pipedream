import hubspot from "../../hubspot.app.mjs";
import { ENGAGEMENT_TYPE_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "hubspot-get-engagements",
  name: "Get Engagements",
  description: "Retrieves one or more engagements by their IDs. Use this action to fetch details about multiple engagements, such as their types, timestamps, and associated CRM objects. Requires engagement IDs, which you can obtain from the **List CRM Objects** action. [See the documentation](https://developers.hubspot.com/docs/api-reference/legacy/crm/objects/objects/batch/get-objects)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hubspot,
    engagementType: {
      type: "string",
      label: "Engagement Type",
      description:
        "One of: `notes`, `tasks`, `meetings`, `emails`, or `calls`. "
        + "Defines the CRM object type listed and which properties belong in **Object Properties**.",
      async options() {
        return ENGAGEMENT_TYPE_OPTIONS;
      },
    },
    engagementIds: {
      propDefinition: [
        hubspot,
        "objectIds",
        (c) => ({
          objectType: c.engagementType,
        }),
      ],
      label: "Engagement IDs",
      description: "Array of engagement record IDs to retrieve. Example: `[\"191980186487\", \"191980186488\"]`.",
    },
    properties: {
      type: "string[]",
      label: "Properties",
      description:
        "Property names to include in results. Example: `[\"hs_note_body\"]` for notes or `[\"hs_task_subject\", \"hs_task_body\"]` for tasks."
        + " Use **Search Properties** to discover available property names."
        + " If not specified, engagement-type defaults should be returned.",
      optional: true,
      async options() {
        if (!this.engagementType) {
          return [];
        }
        const { results: properties } = await this.hubspot.getProperties({
          objectType: this.engagementType,
        });
        return properties?.map((property) => ({
          label: property.label,
          value: property.name,
        })) || [];
      },
    },
  },
  async run({ $ }) {
    const properties = this.properties?.length
      ? this.properties
      : (await this.hubspot.getProperties({
        $,
        objectType: this.engagementType,
      }))?.results.map((property) => property.name);

    const response = await this.hubspot.batchGetObjects({
      $,
      objectType: this.engagementType,
      data: {
        inputs: this.engagementIds.map((id) => ({
          id,
        })),
        properties,
      },
    });
    const count = response?.results?.length ?? 0;
    $.export("$summary", `Retrieved ${count} ${this.engagementType} engagement${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
