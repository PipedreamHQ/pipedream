import common from "../common-create.mjs";
import { ConfigurationError } from "@pipedream/platform";
import {
  API_PATH, ASSOCIATION_CATEGORY,
} from "../../common/constants.mjs";

export default {
  ...common,
  key: "hubspot-create-engagement",
  name: "Create Engagement",
  description: "Create a new engagement for a contact. [See the docs here](https://developers.hubspot.com/docs/api/crm/engagements)",
  version: "0.0.8",
  type: "action",
  props: {
    ...common.props,
    engagementType: {
      type: "string",
      label: "Engagement Type",
      description: "The type of engagement to create",
      reloadProps: true,
      options: [
        {
          label: "Note",
          value: "notes",
        },
        {
          label: "Task",
          value: "tasks",
        },
        {
          label: "Meeting",
          value: "meetings",
        },
        {
          label: "Email",
          value: "emails",
        },
        {
          label: "Call",
          value: "calls",
        },
      ],
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
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return this.engagementType;
    },
    async createEngagement(objectType, properties, associations, $) {
      return this.hubspot.makeRequest(
        API_PATH.CRMV3,
        `/objects/${objectType}`,
        {
          method: "POST",
          data: {
            properties,
            associations,
          },
          $,
        },
      );
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
      ...properties
    } = this;

    if ((toObjectId && !associationType) || (!toObjectId && associationType)) {
      throw new ConfigurationError("Both `toObjectId` and `associationType` must be entered");
    }

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

    const engagement = await this.createEngagement(objectType, properties, associations, $);

    const objectName = hubspot.getObjectTypeName(objectType);
    $.export("$summary", `Successfully created ${objectName} for the contact`);

    return engagement;
  },
};
