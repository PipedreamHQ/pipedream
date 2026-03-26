import servicem8 from "../../servicem8.app.mjs";
import { optionalBool01 } from "../../common/payload.mjs";

export default {
  key: "servicem8-update-staff",
  name: "Update Staff Member",
  description: "Update a staff member (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updatestaffmembers)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8,
    uuid: {
      type: "string",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "staff",
          prevContext,
          query,
        });
      },
      label: "Staff member to update",
      description: "Staff record to load, merge, and save (search or paste UUID).",
    },
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
      description: "Job the staff member is currently navigating to.",
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
        "Permission set ([API `security_role_uuid`](https://developer.servicem8.com/reference/updatestaffmembers)).",
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
        "Default labour inventory material ([API `labour_material_uuid`](https://developer.servicem8.com/reference/updatestaffmembers)).",
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
    const response = await this.servicem8.updateStaff({
      $,
      uuid: this.uuid,
      data: {
        first: this.first,
        last: this.last,
        email: this.email,
        mobile: this.mobile,
        job_title: this.jobTitle,
        navigating_to_job_uuid: this.navigatingToJobUuid,
        color: this.color,
        custom_icon_url: this.customIconUrl,
        status_message: this.statusMessage,
        hide_from_schedule: optionalBool01(this.hideFromSchedule),
        can_receive_push_notification: this.canReceivePushNotification,
        security_role_uuid: this.securityRoleUuid,
        labour_material_uuid: this.labourMaterialUuid,
      },
    });
    $.export("$summary", `Updated Staff ${this.uuid}`);
    return response;
  },
};
