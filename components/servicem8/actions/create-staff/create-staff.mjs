import servicem8 from "../../servicem8.app.mjs";
import { optionalBool01 } from "../../common/payload.mjs";

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
      description:
        "Job the staff member is currently navigating to (`navigating_to_job_uuid`).",
    },
    color: {
      type: "string",
      label: "Color",
      optional: true,
      description:
        "Hex color for schedule and dispatch display (`color`).",
    },
    statusMessage: {
      type: "string",
      label: "Status message",
      optional: true,
      description: "Short summary of current status (`status_message`).",
    },
    statusMessageTimestamp: {
      type: "string",
      label: "Status message timestamp",
      optional: true,
      description:
        "When the status message was last updated (`status_message_timestamp`; e.g. `YYYY-MM-DD HH:MM:SS`).",
    },
    hideFromSchedule: {
      type: "boolean",
      label: "Hide from schedule",
      optional: true,
      description:
        "Enable to hide this staff member from the schedule (`hide_from_schedule`).",
    },
    securityRoleUuid: {
      type: "string",
      label: "Security Role",
      optional: true,
      description:
        "Permission set ([API `security_role_uuid`](https://developer.servicem8.com/reference/createstaffmembers)).",
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
        "Default labour inventory material ([API `labour_material_uuid`](https://developer.servicem8.com/reference/createstaffmembers)).",
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
        job_title: this.jobTitle,
        navigating_to_job_uuid: this.navigatingToJobUuid,
        color: this.color,
        status_message: this.statusMessage,
        status_message_timestamp: this.statusMessageTimestamp,
        hide_from_schedule: optionalBool01(this.hideFromSchedule),
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
