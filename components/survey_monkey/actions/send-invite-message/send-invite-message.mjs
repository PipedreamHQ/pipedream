import surveyMonkey from "../../survey_monkey.app.mjs";
import base from "../common/base-survey.mjs";

export default {
  ...base,
  key: "survey_monkey-send-invite-message",
  name: "Send Invite Message",
  description: "Send an invite message to its recipients, immediately or at a scheduled date. Create the message with **Create Invite Message** and add its recipients with **Add Message Recipients** first. SurveyMonkey only sends a message whose `status` is `not_sent`, so one that has already been sent or is still `processing` is rejected. [See the documentation](https://api.surveymonkey.com/v3/docs?javascript#api-endpoints-post-collectors-collector_id-messages-message_id-send)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...base.props,
    collectorId: {
      propDefinition: [
        surveyMonkey,
        "collectorId",
        (c) => ({
          surveyId: c.survey,
        }),
      ],
    },
    messageId: {
      propDefinition: [
        surveyMonkey,
        "messageId",
      ],
      description: "The ID of the invite message to send. Its `status` must be `not_sent` — run **List Invite Messages** with **Status** `not_sent` to find one, since this endpoint rejects a message that is already `sent` or still `processing`.",
    },
    scheduledDate: {
      type: "string",
      label: "Scheduled Date",
      description: "When the message should send, e.g. `2026-12-03T10:15:30+00:00`. Omit to send immediately.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surveyMonkey.sendMessage({
      $,
      collectorId: this.collectorId,
      messageId: this.messageId,
      data: {
        scheduled_date: this.scheduledDate,
      },
    });

    $.export("$summary", this.scheduledDate
      ? `Successfully scheduled message #${this.messageId} for ${this.scheduledDate}`
      : `Successfully sent message #${this.messageId} to ${response?.recipients?.length ?? 0} recipient(s)`);

    return response;
  },
};
