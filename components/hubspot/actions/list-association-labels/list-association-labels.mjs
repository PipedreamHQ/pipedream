import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-list-association-labels",
  name: "List Association Labels",
  description:
    "List association type definitions (labels and type IDs) between two object types in CRM v4."
    + " Use the returned `typeId` values when creating associations with **Create Association** or **Create CRM Object** (associations JSON)."
    + " Order matters: from/to defines the direction of the relationship."
    + " [See the documentation](https://developers.hubspot.com/docs/api-reference/crm/associations-v4/definitions/get-crm-v4-associations-fromToObjectType-toToObjectType-labels)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hubspot,
    fromObjectType: {
      propDefinition: [
        hubspot,
        "objectType",
      ],
      label: "From Object Type",
      description:
        "First object type in the association pair (directional).",
    },
    toObjectType: {
      propDefinition: [
        hubspot,
        "objectType",
      ],
      label: "To Object Type",
      description:
        "Second object type in the association pair.",
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
