import app from "../../lever_oauth.app.mjs";

export default {
  key: "lever_oauth-create-interview",
  name: "Create Interview",
  description:
    "Schedules an interview for a candidate opportunity."
    + " Use this when asked to set up, book, or schedule an interview for a candidate."
    + " `panel` (Interview Panel UID), `interviewers`, `date`, `duration`, and Perform As are all required."
    + " Interviews can only be created on panels where `externallyManaged == true`."
    + " `date` is a single Unix timestamp in milliseconds for when the interview occurs (e.g. `1700000000000`)."
    + " `duration` is in minutes (e.g. `60`)."
    + " `interviewers` is a comma-separated list of user IDs — each will be assigned to the interview. Use **List Users** to find user IDs."
    + " Use **Search Opportunities** to find the opportunity ID."
    + " [See the documentation](https://hire.lever.co/developer/documentation#create-an-interview)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    opportunityId: {
      type: "string",
      label: "Opportunity ID",
      description: "The ID of the opportunity to schedule an interview for. Use **Search Opportunities** to find opportunity IDs.",
    },
    performAs: {
      type: "string",
      label: "Perform As (User ID)",
      description: "User ID of the person scheduling the interview — sets the interview creator. Use **List Users** to find user IDs.",
    },
    panelId: {
      type: "string",
      label: "Panel ID",
      description: "Interview Panel UID. The panel must have `externallyManaged == true`. Use **List Interviews** to find existing panel IDs.",
    },
    interviewers: {
      type: "string",
      label: "Interviewer User IDs",
      description: "Comma-separated list of user IDs for interviewers (at least one required). Use **List Users** to find user IDs. Example: `abc123,def456`",
    },
    date: {
      type: "integer",
      label: "Date (Unix ms)",
      description: "Scheduled start time as a Unix timestamp in milliseconds (e.g. `1700000000000`).",
    },
    duration: {
      type: "integer",
      label: "Duration (minutes)",
      description: "Interview duration in minutes. Minimum value is 1 (e.g. `30`, `60`).",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Interview subject or title (e.g. `Technical Screen - Jane Doe`).",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Instructions or agenda for interviewers.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "Interview location — conference room name, phone number, or video link (e.g. `https://meet.google.com/abc-defg`).",
      optional: true,
    },
    feedbackReminder: {
      type: "string",
      label: "Feedback Reminder",
      description: "Frequency of feedback reminders to interviewers. Defaults to `frequently` (every 6 hours) if omitted.",
      optional: true,
      options: [
        "once",
        "daily",
        "frequently",
        "none",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      perform_as: this.performAs,
    };

    const interviewers = this.interviewers
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
      .map((id) => ({
        id,
      }));

    const body = {
      panel: this.panelId,
      interviewers,
      date: this.date,
      duration: this.duration,
    };
    if (this.subject) body.subject = this.subject;
    if (this.note) body.note = this.note;
    if (this.location) body.location = this.location;
    if (this.feedbackReminder) body.feedbackReminder = this.feedbackReminder;

    const response = await this.app.createInterview(this.opportunityId, {
      $,
      params,
      data: body,
    });
    const result = response.data ?? response;
    $.export("$summary", `Created interview for opportunity ${this.opportunityId}`);
    return result;
  },
};
