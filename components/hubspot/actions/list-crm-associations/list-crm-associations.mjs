import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-list-crm-associations",
  name: "List CRM Associations",
  description:
    "List CRM v4 associations from a source record to a target object type."
    + " Returns associated record IDs and association types for each link."
    + " Direction matters: `from` is the record you are querying from; swap from/to to traverse the relationship the other way."
    + " [See the documentation](https://developers.hubspot.com/docs/api-reference/crm/associations-v4/basic/get-crm-v4-objects-objectType-objectId-associations-toObjectType)",
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
        "Object type of the record you are listing associations from.",
    },
    fromObjectId: {
      propDefinition: [
        hubspot,
        "objectId",
        ({ fromObjectType }) => ({
          objectType: fromObjectType,
        }),
      ],
      label: "From Object ID",
      description:
        "The source record’s HubSpot ID. After choosing **From Object Type**, pick from the list or enter an ID (for contacts you can search by email).",
    },
    toObjectType: {
      propDefinition: [
        hubspot,
        "objectType",
      ],
      label: "To Object Type",
      description:
        "Object type of associated records to return (e.g. contacts linked to this company).",
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.getAssociations({
      $,
      objectType: this.fromObjectType,
      objectId: this.fromObjectId,
      toObjectType: this.toObjectType,
    });

    const count = response?.results?.length ?? 0;
    $.export(
      "$summary",
      `Found ${count} association${count === 1
        ? ""
        : "s"} from ${this.fromObjectType} \`${this.fromObjectId}\` to ${this.toObjectType}`,
    );
    return response;
  },
};
