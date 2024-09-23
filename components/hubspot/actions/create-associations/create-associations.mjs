import hubspot from "../../hubspot.app.mjs";
import { ASSOCIATION_CATEGORY } from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "hubspot-create-associations",
  name: "Create Associations",
  description: "Create associations between objects. [See the documentation](https://developers.hubspot.com/docs/api/crm/associations#endpoint?spec=POST-/crm/v3/associations/{fromObjectType}/{toObjectType}/batch/create)",
  version: "0.0.9",
  type: "action",
  props: {
    hubspot,
    fromObjectType: {
      propDefinition: [
        hubspot,
        "objectType",
      ],
      label: "From Object Type",
      description: "The type of the object being associated",
    },
    fromObjectId: {
      propDefinition: [
        hubspot,
        "objectIds",
        (configuredProps) => ({
          objectType: configuredProps.fromObjectType,
        }),
      ],
      type: "string",
      label: "From Object",
      description: "The ID of the object being associated",
    },
    toObjectType: {
      propDefinition: [
        hubspot,
        "objectType",
      ],
      label: "To Object Type",
      description: "Type of the objects the from object is being associated with",
    },
    associationType: {
      propDefinition: [
        hubspot,
        "associationType",
        (configuredProps) => ({
          fromObjectType: configuredProps.fromObjectType,
          toObjectType: configuredProps.toObjectType,
        }),
      ],
    },
    toObjectIds: {
      propDefinition: [
        hubspot,
        "objectIds",
        (configuredProps) => ({
          objectType: configuredProps.toObjectType,
        }),
      ],
      label: "To Objects",
      description: "Id's of the objects the from object is being associated with",
    },
  },
  async run({ $ }) {
    const {
      fromObjectType,
      fromObjectId,
      toObjectType,
      associationType,
    } = this;
    let toObjectIds;
    if (Array.isArray(this.toObjectIds)) {
      toObjectIds = this.toObjectIds;
    } else {
      try {
        toObjectIds = JSON.parse(this.toObjectIds);
      } catch {
        throw new ConfigurationError("Could not parse \"To Objects\" array.");
      }
    }
    const response = await this.hubspot.createAssociations({
      $,
      fromObjectType,
      toObjectType,
      data: {
        inputs: toObjectIds.map((toId) => ({
          from: {
            id: fromObjectId,
          },
          to: {
            id: toId,
          },
          types: [
            {
              associationCategory: ASSOCIATION_CATEGORY.HUBSPOT_DEFINED,
              associationTypeId: associationType,
            },
          ],
        })),
      },
    });
    const l = response.results.length;
    $.export("$summary", `Successfully created ${l} association${l === 1
      ? ""
      : "s"}`);
    return response;
  },
};
