import microsoft from "../../microsoft_dynamics_365_sales.app.mjs";
import {
  APPOINTMENT_CATEGORY_OF_APPOINTMENT_FIELD,
  parseScheduleMs,
} from "../../common/utils.mjs";

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

    const startProvided = this.scheduledstart !== undefined;
    const endProvided = this.scheduledend !== undefined;
    if (startProvided && endProvided) {
      const startMs = Date.parse(this.scheduledstart);
      const endMs = Date.parse(this.scheduledend);
      if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) {
        throw new Error(
          "scheduledstart and scheduledend must be valid ISO 8601 datetimes when both are provided",
        );
      }
      if (endMs <= startMs) {
        throw new Error("scheduledend must be after scheduledstart");
      }
    } else if (startProvided || endProvided) {
      const existing = await this.microsoft.getAppointment({
        $,
        appointmentId: this.appointmentId,
      });
      if (startProvided) {
        const startMs = parseScheduleMs(this.scheduledstart, "scheduledstart");
        const endMs = Date.parse(existing?.scheduledend);
        if (!Number.isFinite(endMs)) {
          throw new Error(
            "Cannot validate schedule: existing scheduledend is missing; provide both scheduledstart and scheduledend",
          );
        }
        if (endMs <= startMs) {
          throw new Error("scheduledend must be after scheduledstart");
        }
      } else {
        const endMs = parseScheduleMs(this.scheduledend, "scheduledend");
        const startMs = Date.parse(existing?.scheduledstart);
        if (!Number.isFinite(startMs)) {
          throw new Error(
            "Cannot validate schedule: existing scheduledstart is missing; provide both scheduledstart and scheduledend",
          );
        }
        if (endMs <= startMs) {
          throw new Error("scheduledend must be after scheduledstart");
        }
      }
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
