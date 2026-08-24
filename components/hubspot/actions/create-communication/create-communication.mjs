// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import { ASSOCIATION_CATEGORY } from "../../common/constants.mjs";
import appProp from "../common/common-app-prop.mjs";
import common from "../common/common-create.mjs";
import { parseObjectProperties } from "../../common/utils.mjs";

export default {
  ...common,
  key: "hubspot-create-communication",
  name: "Create Communication",
  description:
    "Log a WhatsApp, LinkedIn, or SMS communication in HubSpot. Put the message fields in **Object Properties** (`hs_communication_channel_type` = `SMS` | `WHATS_APP` | `LINKEDIN_MESSAGE`, `hs_communication_body`); `hs_communication_logged_from` and `hs_timestamp` are set for you. Optionally associate it with a record via **Associated Object Type/ID** + **Association Type**. Example: Object Properties `{ \"hs_communication_channel_type\": \"SMS\", \"hs_communication_body\": \"Reminder: call at 9am\" }`. Returns the created communication with its id. [See the documentation](https://developers.hubspot.com/beta-docs/reference/api/crm/engagements/communications/v3#post-%2Fcrm%2Fv3%2Fobjects%2Fcommunications)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...appProp.props,
    toObjectType: {
      propDefinition: [
        appProp.props.hubspot,
        "objectType",
      ],
      label: "Associated Object Type",
      description: "Type of object the communication is being associated with",
      optional: true,
    },
    toObjectId: {
      propDefinition: [
        appProp.props.hubspot,
        "objectId",
        (c) => ({
          objectType: c.toObjectType,
        }),
      ],
      label: "Associated Object",
      description: "ID of object the communication is being associated with",
      optional: true,
    },
    associationType: {
      propDefinition: [
        appProp.props.hubspot,
        "associationType",
        (c) => ({
          fromObjectType: "communications",
          toObjectType: c.toObjectType,
        }),
      ],
      description:
        "A unique identifier to indicate the association type between the communication and the other object",
      optional: true,
    },
    objectProperties: {
      type: "object",
      label: "Object Properties",
      description: "Enter the `communication` properties as a JSON object",
    },
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return "communications";
    },
  },
  async run({ $ }) {
    const {
      hubspot,
      /* eslint-disable no-unused-vars */
      toObjectType,
      toObjectId,
      associationType,
      getObjectType,
      objectProperties,
      ...otherProperties
    } = this;

    if ((toObjectId && !associationType) || (!toObjectId && associationType)) {
      throw new ConfigurationError(
        "Both `toObjectId` and `associationType` must be entered",
      );
    }

    const properties = objectProperties
      ? parseObjectProperties(objectProperties)
      : otherProperties;

    // HubSpot communications require hs_timestamp; default it when not provided.
    if (properties.hs_timestamp == null) {
      properties.hs_timestamp = new Date().toISOString();
    }

    const response = await hubspot.createObject({
      $,
      objectType: getObjectType(),
      data: {
        associations: toObjectId
          ? [
            {
              types: [
                {
                  associationTypeId: associationType,
                  associationCategory: ASSOCIATION_CATEGORY.HUBSPOT_DEFINED,
                },
              ],
              to: {
                id: toObjectId,
              },
            },
          ]
          : undefined,
        properties: {
          ...properties,
          hs_communication_logged_from: "CRM",
        },
      },
    });

    $.export(
      "$summary",
      `Successfully created communication with ID ${response.id}`,
    );
    return response;
  },
};
