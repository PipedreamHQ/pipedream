import { allOptional } from "../../common/action-schema.mjs";
import {
  optionalParsedFloat,
  optionalParsedInt,
} from "../../common/payload.mjs";

/**
 * ServiceM8 staff member create/update body fields.
 * Aligned with [Create staff members](https://developer.servicem8.com/reference/createstaffmembers)
 * and [Update staff members](https://developer.servicem8.com/reference/updatestaffmembers).
 */
export const staffCreateFields = [
  {
    prop: "first",
    api: "first",
    type: "string",
    label: "First Name",
    description: "First name (max 30 characters).",
  },
  {
    prop: "last",
    api: "last",
    type: "string",
    label: "Last Name",
    description: "Last name (max 30 characters).",
  },
  {
    prop: "email",
    api: "email",
    type: "string",
    label: "Email",
    description: "Email address; also used as login name.",
  },
  {
    prop: "mobile",
    api: "mobile",
    type: "string",
    label: "Mobile",
    optional: true,
    description: "Mobile number for SMS and caller identification.",
  },
  {
    prop: "lng",
    api: "lng",
    type: "string",
    label: "Longitude",
    optional: true,
    description: "Last known location (decimal degrees).",
    transform: optionalParsedFloat,
  },
  {
    prop: "lat",
    api: "lat",
    type: "string",
    label: "Latitude",
    optional: true,
    description: "Last known location (decimal degrees).",
    transform: optionalParsedFloat,
  },
  {
    prop: "geoTimestamp",
    api: "geo_timestamp",
    type: "string",
    label: "Geo Timestamp",
    optional: true,
    description: "When lat/lng was last updated (`YYYY-MM-DD HH:MM:SS`).",
  },
  {
    prop: "jobTitle",
    api: "job_title",
    type: "string",
    label: "Job Title",
    optional: true,
    description: "Role or title shown across the product.",
  },
  {
    prop: "navigatingToJobUuid",
    api: "navigating_to_job_uuid",
    propDefinition: "jobUuid",
    optional: true,
    description: "Job the staff member is currently navigating to.",
  },
  {
    prop: "navigatingTimestamp",
    api: "navigating_timestamp",
    type: "string",
    label: "Navigating Timestamp",
    optional: true,
    description: "When navigation started (`YYYY-MM-DD HH:MM:SS`).",
  },
  {
    prop: "navigatingExpiryTimestamp",
    api: "navigating_expiry_timestamp",
    type: "string",
    label: "Navigating Expiry Timestamp",
    optional: true,
    description: "When navigation is expected to complete or expire (`YYYY-MM-DD HH:MM:SS`).",
  },
  {
    prop: "color",
    api: "color",
    type: "string",
    label: "Color",
    optional: true,
    description: "Hex color for schedule and dispatch display.",
  },
  {
    prop: "customIconUrl",
    api: "custom_icon_url",
    type: "string",
    label: "Custom Icon URL",
    optional: true,
    description: "Deprecated in the API.",
  },
  {
    prop: "statusMessage",
    api: "status_message",
    type: "string",
    label: "Status Message",
    optional: true,
    description: "Short summary of current status.",
  },
  {
    prop: "statusMessageTimestamp",
    api: "status_message_timestamp",
    type: "string",
    label: "Status Message Timestamp",
    optional: true,
    description: "When the status message last changed (`YYYY-MM-DD HH:MM:SS`).",
  },
  {
    prop: "hideFromSchedule",
    api: "hide_from_schedule",
    type: "string",
    label: "Hide From Schedule",
    optional: true,
    description: "0 = visible on schedule; 1 = hidden.",
    transform: optionalParsedInt,
  },
  {
    prop: "canReceivePushNotification",
    api: "can_receive_push_notification",
    type: "string",
    label: "Can Receive Push Notification",
    optional: true,
  },
  {
    prop: "securityRoleUuid",
    api: "security_role_uuid",
    type: "string",
    label: "Security Role UUID",
    optional: true,
  },
  {
    prop: "labourMaterialUuid",
    api: "labour_material_uuid",
    type: "string",
    label: "Labour Material UUID",
    optional: true,
    description: "UUID of the linked labour material record.",
  },
];

export const staffUpdateFields = allOptional(staffCreateFields);
