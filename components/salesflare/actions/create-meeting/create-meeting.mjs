import app from "../../salesflare.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "salesflare-create-meeting",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Create Meeting",
  description: "Create a meeting [See the docs here](https://api.salesflare.com/docs#operation/postMeetings)",
  props: {
    app,
    date: {
      type: "string",
      label: "Date",
      description: "Meeting date. It should be in ISO format. e.g. `2019-08-24T14:15:22Z`",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date of the meeting. It should be in ISO format. e.g. `2019-08-24T14:15:22Z`",
      optional: true,
    },
    participants: {
      propDefinition: [
        app,
        "contactId",
      ],
      type: "integer[]",
      label: "Participants",
      description: "Participants of the meeting.",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of meeting max `200` characters.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the meeting.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of the meeting",
      optional: true,
      options: [
        {
          value: "meeting-live",
          label: "LIVE",
        },
        {
          value: "meeting-phone",
          label: "PHONE",
        },
      ],
    },
  },
  async run ({ $ }) {
    const pairs = {
      endDate: "end_date",
    };
    const data = utils.extractProps(this, pairs);
    const resp = await this.app.createMeeting({
      $,
      data,
    });
    $.export("$summary", `Meeting (ID: ${resp.id}) has been created successfully.`);
    return resp;
  },
};
