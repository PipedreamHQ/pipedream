// vandelay-test-dr
import hubspot from "../../hubspot.app.mjs";
import { parseObject } from "../../common/utils.mjs";
import { OBJECT_TYPES } from "../../common/object-types.mjs";

export default {
  key: "hubspot-update-crm-object",
  name: "Update CRM Object",
  description:
    "Update an existing CRM record by ID."
    + " Pass only the properties you want to change — unspecified properties are left unchanged."
    + " Use **Search CRM Objects** to find the record ID,"
    + " **Search Properties** to discover available fields,"
    + " and **Get Properties** to find valid enum values."
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
      description: "The type of CRM object to update.",
      options: OBJECT_TYPES,
    },
    objectId: {
      type: "string",
      label: "Object ID",
      description:
        "The ID of the record to update."
        + " Use **Search CRM Objects** to find record IDs.",
    },
    properties: {
      type: "string",
      label: "Properties",
      description:
        "JSON object of property name-value pairs to update."
        + " Only include the properties you want to change."
        + " Example: `{\"dealstage\": \"closedwon\", \"amount\": \"75000\"}`."
        + " All values must be strings.",
    },
  },
  async run({ $ }) {
    const properties = parseObject(this.properties);

    const response = await this.hubspot.updateObject({
      $,
      objectType: this.objectType,
      objectId: this.objectId,
      data: {
        properties,
      },
    });

    $.export(
      "$summary",
      `Updated ${this.objectType} ${this.objectId}`,
    );

    return response;
  },
};
