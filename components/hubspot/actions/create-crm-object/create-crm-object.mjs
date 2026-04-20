// vandelay-test-dr
import hubspot from "../../hubspot.app.mjs";
import { parseObject } from "../../common/utils.mjs";
import { OBJECT_TYPES } from "../../common/object-types.mjs";

export default {
  key: "hubspot-create-crm-object",
  name: "Create CRM Object",
  description:
    "Create a new CRM record (contact, company, deal, ticket, etc.)."
    + " Pass property values as a JSON object in the `properties` parameter."
    + " Use **Search Properties** to discover available fields for the object type,"
    + " **Get Properties** to find valid enum values (e.g. `lifecyclestage`, `dealstage`),"
    + " and **List Pipelines and Stages** to find valid pipeline/stage IDs for deals and tickets."
    + " Use **List Owners** to find valid `hubspot_owner_id` values."
    + " [See the documentation](https://developers.hubspot.com/docs/api/crm/objects)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hubspot,
    objectType: {
      type: "string",
      label: "Object Type",
      description: "The type of CRM object to create.",
      options: OBJECT_TYPES,
    },
    properties: {
      type: "string",
      label: "Properties",
      description:
        "JSON object of property name-value pairs for the new record."
        + " Example for a contact: `{\"firstname\": \"Jane\", \"lastname\": \"Doe\", \"email\": \"jane@example.com\"}`."
        + " Example for a deal: `{\"dealname\": \"Acme Contract\", \"amount\": \"50000\", \"pipeline\": \"default\", \"dealstage\": \"contractsent\"}`."
        + " All values must be strings. Use **Search Properties** and **Get Properties** to discover valid field names and values.",
    },
    associations: {
      type: "string",
      label: "Associations",
      description:
        "Optional JSON array of associations to create alongside the new record."
        + " Each entry has `to` (object ID to associate with) and `types` (array of association type objects)."
        + " Example: `[{\"to\": {\"id\": \"123\"}, \"types\": [{\"associationCategory\": \"HUBSPOT_DEFINED\", \"associationTypeId\": 1}]}]`."
        + " Use **Create Association** for more control over associations after creation.",
      optional: true,
    },
  },
  async run({ $ }) {
    const properties = parseObject(this.properties);

    const data = {
      properties,
    };

    if (this.associations) {
      data.associations = parseObject(this.associations);
    }

    const response = await this.hubspot.createObject({
      $,
      objectType: this.objectType,
      data,
    });

    $.export(
      "$summary",
      `Created ${this.objectType} with ID ${response.id}`,
    );

    return response;
  },
};
