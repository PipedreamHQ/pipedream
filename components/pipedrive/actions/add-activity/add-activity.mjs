// legacy_hash_id: a_k6iKYA
import { axios } from "@pipedream/platform";

export default {
  key: "pipedrive-add-activity",
  name: "Add Activity",
  description: "Adds a new activity. Includes more_activities_scheduled_in_context property in response's additional_data which indicates whether there are more undone activities scheduled with the same deal, person or organization (depending on the supplied data).",
  version: "0.1.1",
  type: "action",
  props: {
    pipedrive: {
      type: "app",
      app: "pipedrive",
    },
    companydomain: {
      type: "string",
      description: "Your company name as registered in Pipedrive, which becomes part of Pipedrive API base url.",
    },
    subject: {
      type: "string",
      description: "Subject of the activity",
    },
    done: {
      type: "integer",
      description: "Whether the activity is done or not. 0 = Not done, 1 = Done",
      optional: true,
    },
    type: {
      type: "string",
      description: "Type of the activity. This is in correlation with the key_string parameter of ActivityTypes.",
    },
    due_date: {
      type: "string",
      description: "Due date of the activity. Format: YYYY-MM-DD",
      optional: true,
    },
    due_time: {
      type: "string",
      description: "Due time of the activity in UTC. Format: HH:MM",
      optional: true,
    },
    duration: {
      type: "string",
      description: "Duration of the activity. Format: HH:MM",
      optional: true,
    },
    user_id: {
      type: "integer",
      description: "ID of the user whom the activity will be assigned to. If omitted, the activity will be assigned to the authorized user.",
      optional: true,
    },
    deal_id: {
      type: "string",
      description: "ID of the deal this activity will be associated with",
      optional: true,
    },
    person_id: {
      type: "integer",
      description: "ID of the person this activity will be associated with",
      optional: true,
    },
    participants: {
      type: "any",
      description: "List of multiple persons (participants) this activity will be associated with. If omitted, single participant from person_id field is used. It requires a structure as follows: [{\"person_id\":1,\"primary_flag\":true}]",
      optional: true,
    },
    org_id: {
      type: "integer",
      description: "ID of the organization this activity will be associated with",
      optional: true,
    },
    note: {
      type: "string",
      description: "Note of the activity (HTML format)",
      optional: true,
    },
    location: {
      type: "string",
      description: "The address of the activity. Pipedrive will automatically check if the location matches a geo-location on Google maps.",
      optional: true,
    },
    public_description: {
      type: "string",
      description: "Additional details about the activity that will be synced to your external calendar. Unlike the note added to the activity, the description will be publicly visible to any guests added to the activity.",
      optional: true,
    },
    busy_flag: {
      type: "boolean",
      description: "Set the activity as 'Busy' or 'Free'. If the flag is set to true, your customers will not be able to book that time slot through any Scheduler links",
      optional: true,
    },
    attendees: {
      type: "any",
      description: "Attendees of the activity. This can be either your existing Pipedrive contacts or an external email address. It requires a structure as follows: [{\"email_address\":\"mail@example.org\"}] or [{\"person_id\":1, \"email_address\":\"mail@example.org\"}",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the Pipedrive API docs for Activities here: https://developers.pipedrive.com/docs/api/v1/#!/Activities
  //For for info on adding an activity in Pipedrive: https://pipedrive.readme.io/docs/adding-an-activity
    const config = {
      method: "post",
      url: `https://${this.companydomain}.pipedrive.com/v1/activities`,
      data: {
        subject: this.subject,
        done: this.done,
        type: this.type,
        due_date: this.due_date,
        due_time: this.due_time,
        duration: this.duration,
        user_id: this.user_id,
        deal_id: this.deal_id,
        person_id: this.person_id,
        participants: typeof this.participants == "undefined"
          ? this.participants
          : JSON.parse(this.participants),
        org_id: this.org_id,
        note: this.note,
        location: this.location,
        public_description: this.public_description,
        busy_flag: this.busy_flag,
        attendees: typeof this.attendees == "undefined"
          ? this.attendees
          : JSON.parse(this.attendees),
      },
      headers: {
        Authorization: `Bearer ${this.pipedrive.$auth.oauth_access_token}`,
      },

    };
    return await axios($, config);
  },
};
