import servicem8 from "../../servicem8.app.mjs";
import {
  optionalParsedFloat,
  optionalParsedInt,
} from "../../common/payload.mjs";

export default {
  key: "servicem8-create-staff",
  name: "Create Staff Member",
  description: "Create a staff member. [See the documentation](https://developer.servicem8.com/reference/createstaffmembers)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8,
    first: {
      type: "string",
      label: "First Name",
      description: "First name (max 30 characters).",
    },
    last: {
      type: "string",
      label: "Last Name",
      description: "Last name (max 30 characters).",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address; also used as login name.",
    },
    mobile: {
      type: "string",
      label: "Mobile",
      optional: true,
      description: "Mobile number for SMS and caller identification.",
    },
    lng: {
      type: "string",
      label: "Longitude",
      optional: true,
      description: "Last known location (decimal degrees).",
    },
    lat: {
      type: "string",
      label: "Latitude",
      optional: true,
      description: "Last known location (decimal degrees).",
    },
    geoTimestamp: {
      type: "string",
      label: "Geo Timestamp",
      optional: true,
      description: "When lat/lng was last updated (`YYYY-MM-DD HH:MM:SS`).",
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      optional: true,
      description: "Role or title shown across the product.",
    },
    navigatingToJobUuid: {
      type: "string",
      label: "Navigating to job",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "job",
          prevContext,
          query,
        });
      },
      optional: true,
      description: "Job the staff member is currently navigating to.",
    },
    navigatingTimestamp: {
      type: "string",
      label: "Navigating Timestamp",
      optional: true,
      description: "When navigation started (`YYYY-MM-DD HH:MM:SS`).",
    },
    navigatingExpiryTimestamp: {
      type: "string",
      label: "Navigating Expiry Timestamp",
      optional: true,
      description: "When navigation is expected to complete or expire (`YYYY-MM-DD HH:MM:SS`).",
    },
    color: {
      type: "string",
      label: "Color",
      optional: true,
      description: "Hex color for schedule and dispatch display.",
    },
    customIconUrl: {
      type: "string",
      label: "Custom Icon URL",
      optional: true,
      description: "Deprecated in the API.",
    },
    statusMessage: {
      type: "string",
      label: "Status Message",
      optional: true,
      description: "Short summary of current status.",
    },
    statusMessageTimestamp: {
      type: "string",
      label: "Status Message Timestamp",
      optional: true,
      description: "When the status message last changed (`YYYY-MM-DD HH:MM:SS`).",
    },
    hideFromSchedule: {
      type: "string",
      label: "Hide From Schedule",
      optional: true,
      description: "0 = visible on schedule; 1 = hidden.",
    },
    canReceivePushNotification: {
      type: "string",
      label: "Can Receive Push Notification",
      optional: true,
      description: "Whether this staff member can receive push notifications (API string/flag).",
    },
    securityRoleUuid: {
      type: "string",
      label: "Security Role",
      optional: true,
      description:
        "Permission set for this staff member ([API `security_role_uuid`](https://developer.servicem8.com/reference/createstaffmembers)).",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "securityrole",
          prevContext,
          query,
        });
      },
    },
    labourMaterialUuid: {
      type: "string",
      label: "Labour Material",
      optional: true,
      description:
        "Default labour inventory material for this staff member ([API `labour_material_uuid`](https://developer.servicem8.com/reference/createstaffmembers)).",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "material",
          prevContext,
          query,
        });
      },
    },
  },
  async run({ $ }) {
    const {
      body, recordUuid,
    } = await this.servicem8.createStaff({
      $,
      data: {
        first: this.first,
        last: this.last,
        email: this.email,
        mobile: this.mobile,
        lng: optionalParsedFloat(this.lng),
        lat: optionalParsedFloat(this.lat),
        geo_timestamp: this.geoTimestamp,
        job_title: this.jobTitle,
        navigating_to_job_uuid: this.navigatingToJobUuid,
        navigating_timestamp: this.navigatingTimestamp,
        navigating_expiry_timestamp: this.navigatingExpiryTimestamp,
        color: this.color,
        custom_icon_url: this.customIconUrl,
        status_message: this.statusMessage,
        status_message_timestamp: this.statusMessageTimestamp,
        hide_from_schedule: optionalParsedInt(this.hideFromSchedule),
        can_receive_push_notification: this.canReceivePushNotification,
        security_role_uuid: this.securityRoleUuid,
        labour_material_uuid: this.labourMaterialUuid,
      },
    });
    $.export("$summary", `Created Staff Member${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
