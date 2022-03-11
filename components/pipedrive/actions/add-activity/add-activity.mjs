import pipedriveApp from "../../pipedrive.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "pipedrive-add-activity",
  name: "Add Activity",
  description: "Adds a new activity. Includes more_activities_scheduled_in_context property in response's additional_data which indicates whether there are more undone activities scheduled with the same deal, person or organization (depending on the supplied data). See the Pipedrive API docs for Activities [here](https://developers.pipedrive.com/docs/api/v1/#!/Activities). For info on [adding an activity in Pipedrive](https://pipedrive.readme.io/docs/adding-an-activity)",
  version: "0.1.3",
  type: "action",
  props: {
    pipedriveApp,
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the activity",
    },
    done: {
      type: "integer",
      label: "Done",
      description: "Whether the activity is done or not. 0 = Not done, 1 = Done",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of the activity. This is in correlation with the key_string parameter of ActivityTypes.",
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Due date of the activity. Format: YYYY-MM-DD",
      optional: true,
    },
    dueTime: {
      type: "string",
      label: "Due Time",
      description: "Due time of the activity in UTC. Format: HH:MM",
      optional: true,
    },
    duration: {
      type: "string",
      label: "Duration",
      description: "Duration of the activity. Format: HH:MM",
      optional: true,
    },
    userId: {
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
      description: "ID of the user whom the activity will be assigned to. If omitted, the activity will be assigned to the authorized user.",
    },
    dealId: {
      type: "string",
      label: "Deal ID",
      description: "ID of the deal this activity will be associated with",
      optional: true,
    },
    personId: {
      propDefinition: [
        pipedriveApp,
        "personId",
      ],
      description: "ID of the person this activity will be associated with",
    },
    participants: {
      type: "any",
      label: "Participants",
      description: "List of multiple persons (participants) this activity will be associated with. If omitted, single participant from person_id field is used. It requires a structure as follows: [{\"person_id\":1,\"primary_flag\":true}]",
      optional: true,
    },
    organizationId: {
      propDefinition: [
        pipedriveApp,
        "organizationId",
      ],
      description: "ID of the organization this activity will be associated with",
    },
    note: {
      type: "string",
      label: "Note",
      description: "Note of the activity (HTML format)",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "The address of the activity. Pipedrive will automatically check if the location matches a geo-location on Google maps.",
      optional: true,
    },
    publicDescription: {
      type: "string",
      label: "Public Description",
      description: "Additional details about the activity that will be synced to your external calendar. Unlike the note added to the activity, the description will be publicly visible to any guests added to the activity.",
      optional: true,
    },
    busyFlag: {
      type: "boolean",
      label: "Busy Flag",
      description: "Set the activity as 'Busy' or 'Free'. If the flag is set to true, your customers will not be able to book that time slot through any Scheduler links",
      optional: true,
    },
    attendees: {
      type: "any",
      label: "Attendees",
      description: "Attendees of the activity. This can be either your existing Pipedrive contacts or an external email address. It requires a structure as follows: [{\"email_address\":\"mail@example.org\"}] or [{\"person_id\":1, \"email_address\":\"mail@example.org\"}",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      subject,
      done,
      type,
      dueDate,
      dueTime,
      duration,
      userId,
      dealId,
      personId,
      participants,
      organizationId,
      note,
      location,
      publicDescription,
      busyFlag,
      attendees,
    } = this;

    const resp =
      await this.pipedriveApp.addActivity({
        subject,
        done,
        type,
        due_date: dueDate,
        due_time: dueTime,
        duration,
        user_id: userId,
        deal_id: dealId,
        person_id: personId,
        participants: utils.parseOrUndefined(participants),
        org_id: organizationId,
        note,
        location,
        public_description: publicDescription,
        busy_flag: busyFlag,
        attendees: utils.parseOrUndefined(attendees),
      });

    $.export("$summary", "Successfully added activity");

    return resp;
  },
};
