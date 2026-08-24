// x-pd-ai: optimized
/* eslint-disable no-unused-vars */
import { ConfigurationError } from "@pipedream/platform";
import {
  ASSOCIATION_CATEGORY, OBJECT_TYPE,
} from "../../common/constants.mjs";
import common from "../common/common-create.mjs";
import { parseObjectProperties } from "../../common/utils.mjs";

export default {
  ...common,
  key: "hubspot-create-meeting",
  name: "Create Meeting",
  description:
    "Create a meeting engagement in HubSpot. Put meeting fields in **Object Properties** (`hs_meeting_title`, `hs_meeting_body`, `hs_meeting_start_time`, `hs_meeting_end_time` as ISO-8601); `hs_timestamp` defaults to the start time. Set **Associated Object Type** and optionally link a record via **Associated Object ID** + **Association Type**. Example: Object Properties `{ \"hs_meeting_title\": \"Kickoff\", \"hs_meeting_start_time\": \"2026-08-27T14:00:00Z\", \"hs_meeting_end_time\": \"2026-08-27T15:00:00Z\" }`. Returns the created meeting with its id. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/engagements/meetings#post-%2Fcrm%2Fv3%2Fobjects%2Fmeetings)",
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
      description: "Type of object the meeting is being associated with",
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
      description: "ID of object the meeting is being associated with",
      optional: true,
    },
    associationType: {
      propDefinition: [
        common.props.hubspot,
        "associationType",
        (c) => ({
          fromObjectType: "meetings",
          toObjectType: c.toObjectType,
        }),
      ],
      description:
        "A unique identifier to indicate the association type between the meeting and the other object",
      optional: true,
    },
    objectProperties: {
      type: "object",
      label: "Meeting Properties",
      description:
        "Enter the meeting properties as a JSON object. Required properties: hs_meeting_title, hs_meeting_body, hs_meeting_start_time, hs_meeting_end_time. Optional: hs_meeting_status",
    },
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.MEETING;
    },
    createMeeting(properties, associations, $) {
      return this.hubspot.createMeeting({
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
      toObjectType,
      toObjectId,
      associationType,
      objectProperties,
      ...otherProperties
    } = this;

    if ((toObjectId && !associationType) || (!toObjectId && associationType)) {
      throw new ConfigurationError(
        "Both `toObjectId` and `associationType` must be entered",
      );
    }

    const properties = objectProperties != null
      ? parseObjectProperties(objectProperties)
      : otherProperties;

    // HubSpot meetings require hs_timestamp; default it to the start time (or now).
    if (properties.hs_timestamp == null) {
      properties.hs_timestamp = properties.hs_meeting_start_time ?? new Date().toISOString();
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

    const meeting = await this.createMeeting(properties, associations, $);

    $.export(
      "$summary",
      `Successfully created meeting "${properties.hs_meeting_title}"`,
    );

    return meeting;
  },
};
