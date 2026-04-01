import hubspot from "../../hubspot.app.mjs";
import { OBJECT_TYPES } from "../../common/object-types.mjs";

export default {
  key: "hubspot-list-association-labels",
  name: "List Association Labels",
  description:
    "List association type definitions (labels and type IDs) between two object types in CRM v4."
    + " Use the returned `typeId` values when creating associations with **Create Association** or **Create CRM Object** (associations JSON)."
    + " Order matters: from/to defines the direction of the relationship."
    + " [See the documentation](https://developers.hubspot.com/docs/api-reference/crm/associations-v4/definitions/get-crm-v4-associations-fromToObjectType-toToObjectType-labels)",
  version: "0.0.2"
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hubspot,
    fromObjectType: {
      type: "string",
      label: "From Object Type",
      description: "First object type in the association pair (directional).",
      options: OBJECT_TYPES,
    },
    toObjectType: {
      type: "string",
      label: "To Object Type",
      description: "Second object type in the association pair.",
      options: OBJECT_TYPES,
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.getAssociationTypes({
      $,
      fromObjectType: this.fromObjectType,
      toObjectType: this.toObjectType,
    });

    const count = response?.results?.length ?? 0;
    $.export(
      "$summary",
      `Found ${count} association label${count === 1
        ? ""
        : "s"} for ${this.fromObjectType} → ${this.toObjectType}`,
    );
    return response;
  },
};
