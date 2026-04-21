import { ConfigurationError } from "@pipedream/platform";
import {
  ASSOCIATION_CATEGORY,
  ENGAGEMENT_TYPE_OPTIONS,
} from "../../common/constants.mjs";
import common from "../common/common-create.mjs";

export default {
  ...common,
  key: "hubspot-create-engagement",
  name: "Create Engagement",
  description:
    "Create a **task, meeting, email, call, or note** engagement with optional associations. "
    + "MCP/AI: **Do not use this action for a simple note on a contact by ID** — use **Add Note to Contact** (`hubspot-add-note-to-contact`) instead; it avoids the engagement-type reload step that confuses agents. "
    + "**Engagement Type** has `reloadProps: true`: set `engagementType` first to exactly one of `notes`, `tasks`, `meetings`, `emails`, `calls` (lowercase strings). "
    + "After that, the host reloads props and HubSpot-specific fields appear; use the **CONFIGURE_COMPONENT** tool with `componentKey` `hubspot-create-engagement` and the relevant `propName` to load remote options (object IDs, association types, etc.). "
    + "[See the documentation](https://developers.hubspot.com/docs/api/crm/engagements)",
  version: "0.0.34",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    engagementType: {
      type: "string",
      label: "Engagement Type",
      description:
        "Set this **before** other engagement fields load (`reloadProps`). "
        + "Value must be exactly: `notes`, `tasks`, `meetings`, `emails`, or `calls`. "
        + "For **note on contact by ID**, use **Add Note to Contact** instead.",
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
      description:
        "Association type ID between this engagement and the other object. "
        + "Use **CONFIGURE_COMPONENT** with `propName` `associationType` after `toObjectType` and `engagementType` are set to load valid options.",
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
      return (
        common.methods.isRelevantProperty(property) &&
        !property.name.includes("hs_pipeline")
      );
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
      throw new ConfigurationError(
        "Both `toObjectId` and `associationType` must be entered",
      );
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

    const engagement = await this.createEngagement(
      objectType,
      properties,
      associations,
      $,
    );

    const objectName = hubspot.getObjectTypeName(objectType);
    $.export("$summary", `Successfully created ${objectName} for the contact`);

    return engagement;
  },
};
