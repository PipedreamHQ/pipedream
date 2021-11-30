import twilioClient from "twilio";
import {
  callToString,
  messageToString,
  recordingToString,
} from "./utils.mjs";

export default {
  type: "app",
  app: "twilio",
  propDefinitions: {
    authToken: {
      type: "string",
      secret: true,
      label: "Twilio Auth Token",
      description:
        "Your Twilio auth token, found [in your Twilio console](https://www.twilio.com/console). Required for validating Twilio events.",
    },
    body: {
      type: "string",
      label: "Message Body",
      description: "The text of the message you want to send, limited to 1600 characters.",
    },
    from: {
      type: "string",
      label: "From",
      description: "The phone number or alphanumeric sender ID the message is from",
      async options() {
        const numbers = await this.listIncomingPhoneNumbers();
        return numbers.map((number) => {
          return {
            label: number.friendlyName,
            value: number.phoneNumber,
          };
        });
      },
    },
    incomingPhoneNumber: {
      type: "string",
      label: "Incoming Phone Number",
      description:
        "The Twilio phone number where you'll receive messages. This source creates a webhook tied to this incoming phone number, **overwriting any existing webhook URL**.",
      async options() {
        const numbers = await this.listIncomingPhoneNumbers();
        return numbers.map((number) => {
          return {
            label: number.friendlyName,
            value: number.sid,
          };
        });
      },
    },
    mediaUrl: {
      type: "string[]",
      label: "Media URL",
      description: "The URL of the media you wish to send out with the message. The media size limit is `5MB`. You may provide up to 10 media URLs per message.",
      optional: true,
    },
    responseMessage: {
      type: "string",
      optional: true,
      label: "Response Message",
      description:
        "The message you want to send in response to incoming messages. Leave this blank if you don't need to issue a response.",
    },
    to: {
      type: "string",
      label: "To",
      description: "The destination phone number in E.164 format. Format with a `+` and country code (e.g., `+16175551212`).",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of results to be worked with during one execution cycle.",
      optional: true,
      default: 50,
    },
    messageId: {
      type: "string",
      label: "Message ID",
      description: "The SID of the Message",
      optional: true,
      async options() {
        const messages = await this.listMessages();
        return messages.map((message) => {
          return {
            label: this.messageToString(message),
            value: message.sid,
          };
        });
      },
    },
    parentCallSid: {
      type: "string",
      label: "Parent Call SID",
      description: "Only include calls spawned by calls with this SID.",
      optional: true,
      async options() {
        return this.listCallsOptions();
      },
    },
    sid: {
      type: "string",
      label: "Call ID",
      description: "The SID of the Call",
      optional: true,
      async options() {
        return this.listCallsOptions();
      },
    },
    recordingID: {
      type: "string",
      label: "Recording ID",
      description: "The SID of the Recording",
      async options() {
        const recordings = await this.listRecordings();
        return recordings.map((recording) => {
          return {
            label: this.recordingToString(recording),
            value: recording.sid,
          };});
      },
    },
    format: {
      type: "string",
      label: "Format",
      description: "The format of the recording audio file",
      options: [
        {
          label: "MP3",
          value: ".mp3",
        },
        {
          label: "WAV",
          value: ".wav",
        },
      ],
      default: ".wav",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the call",
      optional: true,
      options: [
        "queued",
        "ringing",
        "in-progress",
        "canceled",
        "completed",
        "failed",
        "busy",
        "no-answer",
      ],
    },
  },
  methods: {
    // Static methods
    callToString,
    messageToString,
    recordingToString,

    getClient() {
      return twilioClient(this.$auth.Sid, this.$auth.Secret, {
        accountSid: this.$auth.AccountSid,
      });
    },
    async setWebhookURL(phoneNumberSid, params) {
      const client = this.getClient();
      return await client.incomingPhoneNumbers(phoneNumberSid).update(params);
    },
    async setIncomingSMSWebhookURL(phoneNumberSid, url) {
      const params = {
        smsMethod: "POST",
        smsUrl: url,
      };
      return await this.setWebhookURL(phoneNumberSid, params);
    },
    async setIncomingCallWebhookURL(phoneNumberSid, url) {
      const params = {
        statusCallbackMethod: "POST",
        statusCallback: url,
      };
      return await this.setWebhookURL(phoneNumberSid, params);
    },
    /**
     * Returns a IncomingPhoneNumber list resource representing an account's
     * Twilio phone numbers
     *
     * @param {object} [params] - an object containing parameters to be fed to
     * the Twilio API call, as defined in [the API docs](https://bit.ly/3F8y6KY)
     *
     * @returns the IncomingPhoneNumber list
     */
    async listIncomingPhoneNumbers(params) {
      const client = this.getClient();
      return await client.incomingPhoneNumbers.list(params);
    },
    /**
     * Returns a list of Recordings, each representing a recording generated
     * during a call or conference for the given account
     *
     * @param {object} [params] - an object containing parameters to be fed to
     * the Twilio API call, as defined in [the API docs](https://bit.ly/3mg9ebJ)
     *
     * @returns the list of recordings
     */
    async listRecordings(params) {
      const client = this.getClient();
      return await client.recordings.list(params);
    },
    /**
     * Returns a list of Transcriptions generated from all recordings in an
     * account
     *
     * @param {object} [params] - an object containing parameters to be fed to
     * the Twilio API call, as defined in [the API docs](https://bit.ly/3uwx5HB)
     *
     * @returns the list of transcriptions
     */
    async listTranscriptions(params) {
      const client = this.getClient();
      return await client.transcriptions.list(params);
    },
    /**
     * Returns a list of messages associated with your account. When getting the
     * list of all messages, results will be sorted on the DateSent field with
     * the most recent messages appearing first.
     *
     * @param {object} [params] - an object containing parameters to be fed to the
     * Twilio API call, as defined in [the API docs](https://bit.ly/3mh26eY)
     *
     * @returns the list of messages
     */
    async listMessages(params) {
      const client = this.getClient();
      return await client.messages.list(params);
    },
    /**
     * Returns a single message specified by the provided Message `sid`
     *
     * @param {String} sid - the Twilio-provided string that uniquely identifies
     * the Message resource to fetch
     *
     * @returns the message
     */
    async getMessage(sid) {
      const client = this.getClient();
      return await client.messages(sid).fetch();
    },
    /**
     * Deletes a message record from your account. Once the record is deleted,
     * it will no longer appear in the API and Account Portal logs.
     *
     * @param {String} sid - the Twilio-provided string that uniquely identifies
     * the Message resource to delete
     * @returns `true` on success
     */
    async deleteMessage(sid) {
      const client = this.getClient();
      return await client.messages(sid).remove();
    },
    /**
     * Returns a list of media associated with your message
     *
     * @param {String} messageId - The SID of the Message resource that this
     * Media resource belongs to
     * @param {Object} [params] - an object containing parameters to be fed to the
     * Twilio API call, as defined in [the API docs](https://bit.ly/3mc8apg)
     */
    async listMessageMedia(messageId, params) {
      const client = this.getClient();
      return await client.messages(messageId).media.list(params);
    },
    /**
     * Return a list of phone calls made to and from an account
     *
     * @param {Object} params - an object containing parameters to be fed to the
     * Twilio API call, as defined in [the API docs](https://bit.ly/3iiHIJ9)
     * @returns the list of calls
     */
    async listCalls(params) {
      const client = this.getClient();
      return await client.calls.list(params);
    },
    async listCallsOptions(params = {}) {
      const calls = await this.listCalls(params);
      return calls.map((call) => {
        return {
          label: this.callToString(call),
          value: call.sid,
        };
      });
    },
    /**
     * Returns the Call resource of an individual call, identified by its Call `sid`
     *
     * @param {String} sid - The SID of the Call resource to fetch
     * @returns the Call
     */
    async getCall(sid) {
      const client = this.getClient();
      return await client.calls(sid).fetch();
    },
    /**
     * This will delete a call record from the account. Once the record is
     * deleted, it will no longer appear in the API and Account Portal logs.
     *
     * @param {String} sid - the Twilio-provided Call SID that uniquely identifies
     * the Call resource to delete
     * @returns `true` on success
     */
    async deleteCall(sid) {
      const client = this.getClient();
      return await client.calls(sid).remove();
    },
    /**
     * Returns a recording specified by the provided Recording `sid`
     *
     * @param {String} sid - the Twilio-provided string that uniquely identifies
     * the Recording resource to fetch
     *
     * @returns the recording
     */
    async getRecording(sid) {
      const client = this.getClient();
      return await client.recordings(sid).fetch();
    },
    /**
     * Returns a list of transcriptions available for the recording identified
     * by the Recording `sid`
     *
     * @param {String} sid - the Twilio-provided string that uniquely identifies
     * the Recording resource
     *
     * @returns the list of transcriptions
     */
    async listRecordingTranscriptions(sid, params) {
      const client = this.getClient();
      return await client.recordings(sid).transcriptions.list(params);
    },
  },
};
