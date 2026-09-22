import eventee from "../../eventee.app.mjs";

export default {
  key: "eventee-invite-attendees",
  name: "Invite Attendees",
  description: "Invite attendees to your event in Eventee. [See the documentation](https://publiceventeeapi.docs.apiary.io/#reference/participants/invite-attendees/invite)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    eventee,
    emails: {
      type: "string[]",
      label: "Emails",
      description: "The emails of the attendees to invite",
    },
  },
  async run({ $ }) {
    const response = await this.eventee.inviteAttendees({
      $,
      data: {
        users: this.emails.map((email) => ({
          email,
        })),
      },
    });
    $.export("$summary", `Successfully invited ${this.emails.length} attendees`);
    return response;
  },
};
