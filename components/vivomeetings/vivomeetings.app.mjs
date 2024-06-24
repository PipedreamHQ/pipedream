import { axios } from "@pipedream/platform";
import {
  AUTO_RECORD_OPTIONS,
  MUTE_MODE_OPTIONS,
  TIMEZONE_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "vivomeetings",
  propDefinitions: {
    conferenceId: {
      type: "string",
      label: "Conference ID",
      description: "ID of the conference.",
      async options({ hostId }) {
        const data = await this.listConferences({
          data: {
            host_id: hostId,
          },
        });

        return data.map(({
          conference_id: value, subject: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    companyId: {
      type: "string",
      label: "Company Id",
      description: "The Id of the company.",
    },
    hostId: {
      type: "string",
      label: "Host Id",
      description: "The Id of the host.",
      async options({ companyId }) {
        const data = await this.listHosts({
          data: {
            companyId,
          },
        });

        return data.map(({
          host_id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    contactIds: {
      type: "string[]",
      label: "Contact Ids",
      description: "The unique identification of the contacts.",
      async options({ hostId }) {
        const data = await this.listContacts({
          data: {
            host_id: hostId,
          },
        });

        return data.map(({
          contact_id: value, name, email,
        }) => ({
          label: `${name || email}`,
          value,
        }));
      },
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the meeting.",
    },
    agenda: {
      type: "string",
      label: "Agenda",
      description: "The description of the meeting.",
    },
    start: {
      type: "string",
      label: "Start",
      description: "Start time, this works in conjunction with the time_zone to set the correct time.",
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "Time zone associated with the start time. In the IANA Time Zone database (https://www.iana.org/time-zones)",
      options: TIMEZONE_OPTIONS,
    },
    duration: {
      type: "integer",
      label: "Duration",
      description: "Duration in minutes.",
    },
    autoRecord: {
      type: "string",
      label: "Auto Record",
      description: "Indicates whether the conference should be recorded automatically and the format. If omitted will default to none. Both record and stream must be the same value if recording and streaming together.",
      options: AUTO_RECORD_OPTIONS,
      optional: true,
    },
    autoStream: {
      type: "string",
      label: "Auto Stream",
      description: "Indicates whether the conference should be streamed automatically and the format. If omitted will default to none. Both record and stream must be the same value if recording and streaming together.",
      options: AUTO_RECORD_OPTIONS,
      optional: true,
    },
    autoTranscribe: {
      type: "boolean",
      label: "Auto Transcribe",
      description: "Whether the recording should automatically be transcribed. Valid values are true or false. If omitted will default to false.",
      optional: true,
    },
    oneTimeAccessCode: {
      type: "boolean",
      label: "One Time Access Code",
      description: "When set to true an access code will be returned in the response.",
    },
    secureUrl: {
      type: "boolean",
      label: "Secure URL",
      description: "When set to true the room_url will contain an encrypted access code. Best when used with one_time_access_code.",
      optional: true,
    },
    hostInitiatedRecording: {
      type: "boolean",
      label: "Host Initiated Recording",
      description: "Providing this parameter will change the trigger for automatically starting recording or streaming to also include the host joining the call.",
      optional: true,
    },
    securityPin: {
      type: "string",
      label: "Security Pin",
      description: "Pin required to access the conference.",
    },
    muteMode: {
      type: "string",
      label: "Mute Mode",
      description: "Sets the initial participant mute settings.",
      options: MUTE_MODE_OPTIONS,
    },
    participantEmails: {
      type: "string[]",
      label: "Participant Emails",
      description: "Alternatively participants can be listed via emails with moderators specified. If a participant’s emails is not on the host’s contact list, it will be added.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.url}`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path = "", ...opts
    }) {
      return axios($, {
        ...opts,
        url: this._baseUrl() + path,
        headers: this._headers(),
      });
    },
    listHosts(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/enterprise_api/host/fetch_all",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/enterprise_api/contact/fetch_all",
        ...opts,
      });
    },
    listConferences(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/enterprise_api/conference/fetch_all",
        ...opts,
      });
    },
    createConference(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/enterprise_api/conference/create",
        ...opts,
      });
    },
    updateConference(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/enterprise_api/conference/update",
        ...opts,
      });
    },
    getConferenceDetails(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/enterprise_api/conference/fetch",
        ...opts,
      });
    },
  },
};
