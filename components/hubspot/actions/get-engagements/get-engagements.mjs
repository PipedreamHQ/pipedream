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
      description: "The IDs of the engagements to retrieve",
    },
    properties: {
      type: "string[]",
      label: "Properties",
      description:
        "Property names to include in results."
        + " Use **Search Properties** to discover available property names."
        + " If not specified, returns default properties.",
      optional: true,
      async options() {
        const { results: properties } = await this.hubspot.getProperties({
          objectType: this.engagementType,
        });
        return properties?.map((property) => ({
          label: property.label,
          value: property.name,
        })) || [];
      },
    },
    propertiesWithHistory: {
      type: "string[]",
      label: "Properties with History",
      description: "Key-value pairs for setting properties for the new object and their histories",
      optional: true,
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Whether to return only results that have been archived",
      optional: true,
    },
    idProperty: {
      type: "string",
      label: "ID Property",
      description: "When using a custom unique value property to retrieve records, the name of the property. Do not include this parameter if retrieving by record ID.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.batchGetObjects({
      $,
      objectType: this.engagementType,
      params: {
        archived: this.archived,
      },
      data: {
        inputs: this.engagementIds.map((id) => ({
          id,
        })),
        properties: this.properties,
        propertiesWithHistory: this.propertiesWithHistory,
        idProperty: this.idProperty,
      },
    });
    const count = response?.results?.length ?? 0;
    $.export("$summary", `Retrieved ${count} ${this.engagementType} engagement${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
