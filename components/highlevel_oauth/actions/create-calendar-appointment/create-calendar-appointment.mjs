import common from "../../common/base.mjs";

export default {
  ...common,
  key: "highlevel_oauth-create-calendar-appointment",
  name: "Create Calendar Appointment",
  description: "Creates a new calendar appointment in HighLevel. [See the documentation](https://highlevel.stoplight.io/docs/integrations/db6affea7570b-create-calendar)",
  version: "0.0.22",
  type: "action",
  props: {
    ...common.props,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the appointment",
    },
    calendarId: {
      type: "string",
      label: "Calendar ID",
      description: "The ID of the calendar",
      async options() {
        const calendars = await this.app._makeRequest({
          url: "/calendars/",
          params: {
            locationId: this.app.getLocationId(),
          },
        });
        return calendars?.calendars
          ?.filter(calendar => calendar.isActive)
          .map(({ id: value, name: label }) => ({
            label,
            value,
          })) || [];
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The contact for whom the appointment is scheduled",
      async options() {
        const { contacts } = await this.app._makeRequest({
          url: "/contacts/",
          params: {
            locationId: this.app.getLocationId(),
          },
        });
        return contacts?.map(({
          id, email,
        }) => ({
          label: email,
          value: id.toString(),
        })) || [];
      },
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "Start date and time in the format of example: '2021-06-23T03:30:00+05:30'"
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "End date and time in the format of example: '2021-06-23T03:30:00+05:30'",
      optional: true,
    },
    meetingLocationType: {
      type: "string",
      label: "Meeting Location Type",
      description: "Type of meeting location (e.g., default, custom)",
      options: ["custom", "zoom", "gmeet", "phone", "address", "ms_teams", "google"],
      default: "custom",
      optional: true,
    },
    meetingLocationId: {
      type: "string",
      label: "Meeting Location ID",
      description: "The ID of the meeting location",
      optional: true,
      async options() {
        if (!this.calendarId) {
          return [];
        }

        const { calendar } = await this.app._makeRequest({
          url: `/calendars/${this.calendarId}/`
        });
        const result = [];

        for (const config in calendar?.locationConfigurations) {
          if (config.meetingId) {
            result.push({
              label: config?.kind,
              value: config?.meetingId,
            });
          }
        }

        for (const memberConfig in calendar?.teamMembers) {
          for (const config in memberConfig?.locationConfigurations) {
            if (config.meetingId) {
              result.push({
                label: config?.kind,
                value: config?.meetingId,
              });
            }
          }
        }

        return result;
      },
    },
    overrideLocationConfig: {
      type: "boolean",
      label: "Override Location Config",
      description: "Flag to override location config",
      optional: true,
    },
    appointmentStatus: {
      type: "string",
      label: "Appointment Status",
      description: "Status of the appointment",
      options: ["new", "confirmed", "cancelled", "showed", "noshow", "invalid"],
      optional: true,
    },
    assignedUserId: {
      type: "string",
      label: "Assigned User ID",
      description: "The ID of the user to whom the appointment is assigned",
      optional: true,
      async options() {
        const { users } = await this.app._makeRequest({
          url: "/users/",
          params: {
            locationId: this.app.getLocationId(),
          },
        });
        return users?.map(({ id, email }) => ({
          label: email,
          value: id.toString(), 
        })) || [];
      },
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the appointment",
      optional: true,
    },
    ignoreDateRange: {
      type: "boolean",
      label: "Ignore Date Range",
      description: "If set to true, the minimum scheduling notice and date range would be ignored",
      optional: true,
    },
    toNotify: {
      type: "boolean",
      label: "To Notify",
      description: "If set to false, the automations will not run",
      optional: true,
    },
    ignoreFreeSlotValidation: {
      type: "boolean",
      label: "Ignore Free Slot Validation",
      description: "If true the time slot validation would be avoided for any appointment creation (even the date range)",
      optional: true,
    },

  },
  async run({ $ }) {    
    const { app, ...props } = this;
    $.export("props", props);

    try {
      // Create the calendar appointment
      const response = await this.app.createCalendarAppointment({
        $,        
        data: {...props,locationId: this.app.getLocationId()},
      });

      

      $.export("$summary", `Successfully created calendar appointment`);

      // Return the full response from HighLevel API
      return response;

    } catch (error) {
      // Enhanced error handling with specific messages
      const errorMessage = error.message || "Failed to create calendar appointment";

      // Log the full error for debugging
      console.error("Calendar appointment creation error:", {
        error: error.message,        
        stack: error.stack,
      });

      // Throw a user-friendly error
      throw new Error(`Calendar Appointment Creation Failed: ${errorMessage}`);
    }
  },
};