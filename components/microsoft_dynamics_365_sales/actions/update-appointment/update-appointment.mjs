import microsoft from "../../microsoft_dynamics_365_sales.app.mjs";
import { APPOINTMENT_CATEGORY_OF_APPOINTMENT_FIELD } from "../../common/appointment-fields.mjs";

export default {
  key: "microsoft_dynamics_365_sales-update-appointment",
  name: "Update Appointment",
  description: "Patch an appointment; only supplied fields are sent. Use **List Appointment Categories** for category values. [See the documentation](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/update-and-delete-rows-using-web-api) and the [appointment entity reference](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/reference/appointment)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    microsoft,
    appointmentId: {
      propDefinition: [
        microsoft,
        "appointmentId",
      ],
      optional: false,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Updated subject",
      optional: true,
    },
    scheduledstart: {
      type: "string",
      label: "Scheduled Start",
      description: "Updated start in ISO 8601",
      optional: true,
    },
    scheduledend: {
      type: "string",
      label: "Scheduled End",
      description: "Updated end in ISO 8601",
      optional: true,
    },
    category: {
      propDefinition: [
        microsoft,
        "appointmentCategory",
      ],
      description: "Updated Category of Appointment (numeric option value)",
      optional: true,
    },
  },
  async run({ $ }) {
    const patchBody = {};
    if (this.subject !== undefined) {
      patchBody.subject = this.subject;
    }
    if (this.scheduledstart !== undefined) {
      patchBody.scheduledstart = this.scheduledstart;
    }
    if (this.scheduledend !== undefined) {
      patchBody.scheduledend = this.scheduledend;
    }
    if (this.category !== undefined) {
      patchBody[APPOINTMENT_CATEGORY_OF_APPOINTMENT_FIELD] = this.category;
    }

    if (!Object.keys(patchBody).length) {
      throw new Error("Provide at least one of: subject, scheduledstart, scheduledend, category");
    }

    await this.microsoft.patchAppointment({
      $,
      appointmentId: this.appointmentId,
      data: patchBody,
    });

    $.export("$summary", `Updated appointment ${this.appointmentId}`);

    return {
      appointmentId: this.appointmentId,
      updatedFields: Object.keys(patchBody),
    };
  },
};
