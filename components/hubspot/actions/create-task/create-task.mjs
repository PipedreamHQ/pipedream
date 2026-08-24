// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import { ASSOCIATION_CATEGORY } from "../../common/constants.mjs";
import common from "../common/common-create.mjs";
import { parseObjectProperties } from "../../common/utils.mjs";

export default {
  ...common,
  key: "hubspot-create-task",
  name: "Create Task",
  description:
    "Create a task engagement in HubSpot. Put task fields in **Object Properties** as HubSpot internal names (`hs_task_subject`, `hs_task_body`, `hs_task_status`, `hs_task_priority`); `hs_timestamp` is defaulted for you. Optionally associate it with a record via **Associated Object Type/ID** + **Association Type**. Example: Object Properties `{ \"hs_task_subject\": \"Call Art Vandelay\", \"hs_task_status\": \"NOT_STARTED\", \"hs_task_priority\": \"HIGH\" }`. Returns the created task with its id. [See the documentation](https://developers.hubspot.com/docs/api/crm/engagements)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
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
          fromObjectType: "tasks",
          toObjectType: c.toObjectType,
        }),
      ],
      description:
        "A unique identifier to indicate the association type between the task and the other object",
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
      return "tasks";
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
      toObjectType,
      toObjectId,
      associationType,
      $db,
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

    const objectType = this.getObjectType();

    // HubSpot tasks require hs_timestamp; default it so an agent doesn't have to know that.
    if (properties.hs_timestamp == null) {
      properties.hs_timestamp = new Date().toISOString();
    }

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

    const engagement = await this.createEngagement(
      objectType,
      properties,
      associations,
      $,
    );

    const objectName = hubspot.getObjectTypeName(objectType);
    $.export("$summary", `Successfully created ${objectName}`);

    return engagement;
  },
};
