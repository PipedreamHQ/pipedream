import app from "../../trengo.app.mjs";

export default {
  type: "action",
  key: "trengo-log-a-voice-call",
  version: "0.0.4",
  name: "Log A Voice Call",
  description: "Logs a phone call from external VOIP applications, [See the documentation](https://developers.trengo.com/reference/log-a-phone-call)",
  props: {
    app,
    channelId: {
      propDefinition: [
        app,
        "channelId",
      ],
    },
    recepientPhoneNumber: {
      propDefinition: [
        app,
        "recepientPhoneNumber",
      ],
    },
    callDirection: {
      propDefinition: [
        app,
        "callDirection",
      ],
    },
    contactName: {
      propDefinition: [
        app,
        "contactName",
      ],
      description: "The name of the contact. Only used when the contact does not already exists.",
      optional: true,
    },
    note: {
      propDefinition: [
        app,
        "note",
      ],
    },
    duration: {
      propDefinition: [
        app,
        "duration",
      ],
    },
    recordingUrl: {
      propDefinition: [
        app,
        "recordingUrl",
      ],
    },
  },
  async run ({ $ }) {
    const resp = await this.app.logVoiceCall({
      $,
      data: {
        channel_id: this.channelId,
        phone: this.recepientPhoneNumber,
        direction: this.callDirection,
        contact_name: this.contactName,
        note: this.note,
        duration: this.duration,
        recording_url: this.recordingUrl,
      },
    });
    $.export("$summary", `The voice call has been created for ${this.recepientPhoneNumber}`);
    return resp;
  },
};
