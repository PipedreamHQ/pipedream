import common from "../common/common-create.mjs";
import { ConfigurationError } from "@pipedream/platform";
import {
  ASSOCIATION_CATEGORY, ENGAGEMENT_TYPE_OPTIONS,
} from "../../common/constants.mjs";

export default {
  ...common,
  key: "hubspot-create-engagement",
  name: "Create Engagement",
  description: "Create a new engagement for a contact. [See the documentation](https://developers.hubspot.com/docs/api/crm/engagements)",
  version: "0.0.15",
  type: "action",
  props: {
    ...common.props,
    engagementType: {
      type: "string",
      label: "Engagement Type",
      description: "The type of engagement to create",
      reloadProps: true,
      options: ENGAGEMENT_TYPE_OPTIONS,
    },
    toObjectType: {
      propDefinition: [
        common.props.hubspot,
        "objectType",
      ],
      label: "Associated Object Type",
      description: "Type of object the engagement is being associated with",
      optional: true,
    },
    toObjectId: {
      propDefinition: [
        common.props.hubspot,
        "objectId",
        (c) => ({
          objectType: c.toObjectType,
        }),
      ],
      label: "Associated Object",
      description: "ID of object the engagement is being associated with",
      optional: true,
    },
    associationType: {
      propDefinition: [
        common.props.hubspot,
        "associationType",
        (c) => ({
          fromObjectType: c.engagementType,
          toObjectType: c.toObjectType,
        }),
      ],
      description: "A unique identifier to indicate the association type between the task and the other object",
      optional: true,
    },
    objectProperties: {
      type: "object",
      label: "Object Properties",
      description: "Enter the `engagement` properties as a JSON object",
    },
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return this.engagementType;
    },
    isRelevantProperty(property) {
      return common.methods.isRelevantProperty(property) && !property.name.includes("hs_pipeline");
    },
    createEngagement(objectType, properties, associations, $) {
      return this.hubspot.createObject({
        objectType,
        data: {
          properties,
          associations,
        },
        $,
      });
    },
  },
  async run({ $ }) {
    const {
      hubspot,
      /* eslint-disable no-unused-vars */
      engagementType,
      toObjectType,
      toObjectId,
      associationType,
      $db,
      objectProperties,
      ...otherProperties
    } = this;

    if ((toObjectId && !associationType) || (!toObjectId && associationType)) {
      throw new ConfigurationError("Both `toObjectId` and `associationType` must be entered");
    }

    const properties = objectProperties
      ? typeof objectProperties === "string"
        ? JSON.parse(objectProperties)
        : objectProperties
      : otherProperties;

    const objectType = this.getObjectType();

    const associations = toObjectId
      ? [
        {
          to: {
            id: toObjectId,
          },
          types: [
            {
              associationTypeId: associationType,
              associationCategory: ASSOCIATION_CATEGORY.HUBSPOT_DEFINED,
            },
          ],
        },
      ]
      : undefined;

    if (properties.hs_task_reminders) {
      properties.hs_task_reminders = Date.parse(properties.hs_task_reminders);
    }

    const engagement = await this.createEngagement(objectType, properties, associations, $);

    const objectName = hubspot.getObjectTypeName(objectType);
    $.export("$summary", `Successfully created ${objectName} for the contact`);

    return engagement;
  },
};
