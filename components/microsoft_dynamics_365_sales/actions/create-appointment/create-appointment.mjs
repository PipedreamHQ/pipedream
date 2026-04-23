import microsoft from "../../microsoft_dynamics_365_sales.app.mjs";
import {
  APPOINTMENT_CATEGORY_OF_APPOINTMENT_FIELD,
  appointmentIdFromEntityHeader,
} from "../../common/utils.mjs";

export default {
  key: "microsoft_dynamics_365_sales-create-appointment",
  name: "Create Appointment",
  description: "Create a new appointment linked to an account with a required attendee (system user). Use **List Appointment Categories** for valid category values. [See the documentation](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/create-table-row) and the [appointment entity reference](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/reference/appointment)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    microsoft,
    subject: {
      type: "string",
      label: "Subject",
      description: "Title of the appointment (for example `1st Meeting with {Prospect Name}`)",
    },
    scheduledstart: {
      type: "string",
      label: "Scheduled Start",
      description: "Start in ISO 8601 (for example `2026-02-20T12:00:00Z`)",
    },
    scheduledend: {
      type: "string",
      label: "Scheduled End",
      description: "End in ISO 8601, typically one hour after start",
    },
    regardingAccountId: {
      propDefinition: [
        microsoft,
        "accountId",
      ],
      label: "Regarding Account",
      description: "Account the appointment is regarding",
      optional: false,
    },
    requiredAttendeeEmail: {
      type: "string",
      label: "Required Attendee Email",
      description: "Internal email address of the Dynamics **system user** (salesperson) to add as attendee",
    },
    category: {
      propDefinition: [
        microsoft,
        "appointmentCategory",
      ],
      description: "Optional Category of Appointment (numeric option). Omit to let Dynamics use its default for your org",
      optional: true,
    },
  },
  async run({ $ }) {
    const { value: users } = await this.microsoft.listSystemUsersByEmail({
      $,
      email: this.requiredAttendeeEmail,
    });
    const userId = users?.[0]?.systemuserid;
    if (!userId) {
      throw new Error(`No Dynamics user found with email: ${this.requiredAttendeeEmail}`);
    }

    const appointmentBody = {
      "subject": this.subject,
      "scheduledstart": this.scheduledstart,
      "scheduledend": this.scheduledend,
      "regardingobjectid_account@odata.bind": `/accounts(${this.regardingAccountId})`,
      "appointment_activity_parties": [
        {
          "partyid_systemuser@odata.bind": `/systemusers(${userId})`,
          "participationtypemask": 5,
        },
      ],
    };
    if (this.category !== undefined && this.category !== null) {
      appointmentBody[APPOINTMENT_CATEGORY_OF_APPOINTMENT_FIELD] = this.category;
    }

    const createResponse = await this.microsoft.createAppointment({
      $,
      data: appointmentBody,
      returnFullResponse: true,
    });

    const appointmentPayload = createResponse?.data ?? null;
    const entityHeader =
      createResponse?.headers?.["odata-entityid"] ??
      createResponse?.headers?.["OData-EntityId"] ??
      "";
    const appointmentId =
      appointmentPayload?.activityid ||
      appointmentIdFromEntityHeader(entityHeader);

    const orgRoot = this.microsoft._orgRootUrl().replace(/\/$/, "");
    const deepLink = appointmentId
      ? `${orgRoot}/main.aspx?etn=appointment&pagetype=entityrecord&id=${appointmentId}`
      : "";

    $.export("$summary", `Created appointment${appointmentId
      ? ` ${appointmentId}`
      : ""}`);

    return {
      appointmentId,
      deepLink,
      appointment: appointmentPayload,
    };
  },
};
