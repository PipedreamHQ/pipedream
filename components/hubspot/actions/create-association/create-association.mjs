// vandelay-test-dr
import hubspot from "../../hubspot.app.mjs";
import { OBJECT_TYPES } from "../../common/object-types.mjs";

export default {
  key: "hubspot-create-association",
  name: "Create Association",
  description:
    "Create an association (link) between two CRM records."
    + " For example, associate a contact with a company, a deal with a contact, or a ticket with a company."
    + " Common association type IDs: contact→company (1), company→contact (2),"
    + " deal→contact (3), contact→deal (4), deal→company (5), company→deal (6),"
    + " ticket→contact (15), contact→ticket (16), ticket→company (26), company→ticket (25)."
    + " [See the documentation](https://developers.hubspot.com/docs/api/crm/associations)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hubspot,
    fromObjectType: {
      type: "string",
      label: "From Object Type",
      description: "The object type of the record you're associating from.",
      options: OBJECT_TYPES,
    },
    fromObjectId: {
      type: "string",
      label: "From Object ID",
      description: "The ID of the record you're associating from.",
    },
    toObjectType: {
      type: "string",
      label: "To Object Type",
      description: "The object type of the record you're associating to.",
      options: OBJECT_TYPES,
    },
    toObjectId: {
      type: "string",
      label: "To Object ID",
      description: "The ID of the record you're associating to.",
    },
    associationTypeId: {
      type: "integer",
      label: "Association Type ID",
      description:
        "The numeric ID for the association type."
        + " Common types: contact→company (1), company→contact (2),"
        + " deal→contact (3), contact→deal (4),"
        + " deal→company (5), company→deal (6),"
        + " ticket→contact (15), contact→ticket (16),"
        + " ticket→company (26), company→ticket (25)."
        + " For custom association types, use the HubSpot API to list available types.",
    },
    associationCategory: {
      type: "string",
      label: "Association Category",
      description: "The category of the association.",
      options: [
        {
          label: "HubSpot Defined",
          value: "HUBSPOT_DEFINED",
        },
        {
          label: "User Defined",
          value: "USER_DEFINED",
        },
        {
          label: "Integrator Defined",
          value: "INTEGRATOR_DEFINED",
        },
      ],
      default: "HUBSPOT_DEFINED",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.createAssociation({
      $,
      fromObjectType: this.fromObjectType,
      toObjectType: this.toObjectType,
      fromId: this.fromObjectId,
      toId: this.toObjectId,
      method: "PUT",
      data: [
        {
          associationCategory: this.associationCategory,
          associationTypeId: this.associationTypeId,
        },
      ],
    });

    $.export(
      "$summary",
      `Associated ${this.fromObjectType} ${this.fromObjectId} → ${this.toObjectType} ${this.toObjectId}`,
    );

    return response;
  },
};
