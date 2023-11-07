import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "signalwire",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "A named unique identifier for the room. Allowed characters: A-Za-z0-9_-. Maximum of 100 characters.",
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "Display name of the video conference. Maximum of 200 characters.",
    },
    joinFrom: {
      type: "string",
      label: "Join From",
      description: "Conference does not accept new participants before this time. Expects RFC 3339 datetime: 2022-01-01T23:59:60Z.",
      optional: true,
    },
    joinUntil: {
      type: "string",
      label: "Join Until",
      description: "Conference stops accepting new participants at this time, but keeps running until all participants leave. Expects RFC 3339 datetime: 2022-01-01T23:59:60Z.",
      optional: true,
    },
    quality: {
      type: "string",
      label: "Quality",
      description: "The conference's resolution. Allowed values are 720p or 1080p.",
      optional: true,
      options: [
        "720p",
        "1080p",
      ],
    },
    layout: {
      type: "string",
      label: "Layout",
      description: "The conference's initial layout. Defaults to `grid-responsive`. [See the documentation](https://developer.signalwire.com/guides/layouts/) for additional layout information.",
      optional: true,
      options: [
        "grid-responsive",
        "highlight-1-responsive",
        "screen-share",
        "screen-share-2",
        "full-screen",
      ],
    },
    size: {
      type: "string",
      label: "Size",
      description: "The size of the video conference. Allowed values are small, medium and large.",
      optional: true,
      options: [
        "small",
        "medium",
        "large",
      ],
    },
    recordOnStart: {
      type: "boolean",
      label: "Record On Start",
      description: "Specifies whether to start recording a Conference Session when one is started for this Conference",
      optional: true,
    },
    enableRoomPreviews: {
      type: "boolean",
      label: "Enable Room Previews",
      description: "Whether a video with a preview of the content of the conference is to be generated.",
      optional: true,
    },
    enableChat: {
      type: "boolean",
      label: "Enable Chat",
      description: "Enables group chat for all participants of the room.",
      optional: true,
    },
    e164Number: {
      type: "string",
      label: "Phone Number",
      description: "Number in E.164 format. Example: +15551234567",
    },
    include: {
      type: "string[]",
      label: "Include",
      description: "Further number information to include in the response, some of which are billable. You can specify: `carrier`: Lookup full carrier information for the number. `cnam`: Lookup Caller ID information for the number.",
      options: [
        "carrier",
        "cnam",
      ],
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.domain}.signalwire.com/api`;
    },
    _auth() {
      return {
        username: `${this.$auth.project_id}`,
        password: `${this.$auth.api_key}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        auth: this._auth(),
      });
    },
    createVideoConference(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/video/conferences",
        method: "POST",
      });
    },
    validatePhoneNumber({
      e164Number, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/relay/rest/lookup/phone_number/${e164Number}`,
      });
    },
    listPhoneCallLogs(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/voice/logs",
      });
    },
    listTextMessageLogs(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/messaging/logs",
      });
    },
  },
};
