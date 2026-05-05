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
    + "Set **Engagement Type** and pass engagement fields in **Object Properties** (HubSpot property names, e.g. `hs_note_body` for notes). "
    + "No `reloadProps` step and no **CONFIGURE_COMPONENT** requirement: association fields accept raw HubSpot IDs (use **Search CRM** or the Associations API to resolve `associationType` when needed). "
    + "For **only** a note on a contact by ID, **Add Note to Contact** (`hubspot-add-note-to-contact`) is still simpler. "
    + "[See the documentation](https://developers.hubspot.com/docs/api/crm/engagements)",
  version: "0.1.0",
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
        "One of: `notes`, `tasks`, `meetings`, `emails`, or `calls`. "
        + "Defines the CRM object type created and which properties belong in **Object Properties**. "
        + "For **note on contact by ID**, consider **Add Note to Contact** instead.",
      options: ENGAGEMENT_TYPE_OPTIONS,
    },
    toObjectType: {
      type: "string",
      label: "Associated Object Type",
      description:
        "HubSpot object type to associate (e.g. `contacts`, `companies`, `deals`, `tickets`). "
        + "Use the plural object name or your custom object’s API name / `fullyQualifiedName`. "
        + "Optional unless you set **Associated Object ID**.",
      optional: true,
    },
    toObjectId: {
      type: "string",
      label: "Associated Object ID",
      description:
        "Numeric record ID to associate (string is fine). Optional unless you set **Association Type ID**.",
      optional: true,
    },
    associationType: {
      type: "string",
      label: "Association Type ID",
      description:
        "HubSpot association `typeId` between this engagement type and **Associated Object Type** (integer as string or number). "
        + "Resolve via HubSpot associations API or **Search CRM**; omit if you are not associating a record.",
      optional: true,
    },
    objectProperties: {
      type: "object",
      label: "Object Properties",
      description:
        "Writable HubSpot properties for the engagement as key/value pairs (same shape as the CRM API `properties` object). "
        + "Example for a note: `{ \"hs_note_body\": \"Hello from Pipedream\" }`.",
    },
  },
  /**
   * Skip common-create’s schema-driven `additionalProps` so engagement fields stay in
   * `objectProperties` only — avoids `reloadProps` on `engagementType` and remote options
   * that require CONFIGURE_COMPONENT in MCP/agent hosts.
   */
  async additionalProps() {
    return {};
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

    if (!engagementType) {
      throw new ConfigurationError(
        "`engagementType` is required (one of notes, tasks, meetings, emails, calls).",
      );
    }

    if ((toObjectId && !associationType) || (!toObjectId && associationType)) {
      throw new ConfigurationError(
        "Both **Associated Object ID** and **Association Type ID** must be set together, or both omitted.",
      );
    }

    const properties = objectProperties
      ? typeof objectProperties === "string"
        ? JSON.parse(objectProperties)
        : objectProperties
      : otherProperties;

    const objectType = this.getObjectType();

    const associationTypeId = associationType
      ? Number(associationType)
      : undefined;

    if (toObjectId && (Number.isNaN(associationTypeId) || associationTypeId <= 0)) {
      throw new ConfigurationError(
        "`associationType` must be a positive numeric HubSpot association type ID.",
      );
    }

    const associations = toObjectId
      ? [
        {
          to: {
            id: toObjectId,
          },
          types: [
            {
              associationTypeId: associationTypeId,
              associationCategory: ASSOCIATION_CATEGORY.HUBSPOT_DEFINED,
            },
          ],
        },
      ]
      : undefined;

    if (properties?.hs_task_reminders) {
      properties.hs_task_reminders = Date.parse(properties.hs_task_reminders);
    }

    const engagement = await this.createEngagement(
      objectType,
      properties,
      associations,
      $,
    );

    const objectName = hubspot.getObjectTypeName(objectType);
    $.export("$summary", `Successfully created ${objectName} with ID ${engagement.id}`);

    return engagement;
  },
};
