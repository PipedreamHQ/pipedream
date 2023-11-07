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
    },
    joinUntil: {
      type: "string",
      label: "Join Until",
      description: "Conference stops accepting new participants at this time, but keeps running until all participants leave. Expects RFC 3339 datetime: 2022-01-01T23:59:60Z.",
    },
    quality: {
      type: "string",
      label: "Quality",
      description: "The conference's resolution. Allowed values are 720p or 1080p.",
    },
    layout: {
      type: "string",
      label: "Layout",
      description: "The conference's initial layout. Defaults to grid-responsive.",
    },
    size: {
      type: "string",
      label: "Size",
      description: "The size of the video conference. Allowed values are small, medium and large.",
    },
    recordOnStart: {
      type: "boolean",
      label: "Record On Start",
      description: "Specifies whether to start recording a Conference Session when one is started for this Conference",
    },
    enableRoomPreviews: {
      type: "boolean",
      label: "Enable Room Previews",
      description: "Whether a video with a preview of the content of the conference is to be generated.",
    },
    enableChat: {
      type: "boolean",
      label: "Enable Chat",
      description: "Enables group chat for all participants of the room.",
    },
    e164Number: {
      type: "string",
      label: "Phone Number",
      description: "Number in E.164 format. Example: +15551234567",
      optional: true,
    },
    include: {
      type: "string[]",
      label: "Include",
      description: "Further number information to include in the response, some of which are billable. You can specify: carrier: Lookup full carrier information for the number. cnam: Lookup Caller ID information for the number. Separate multiple values with a comma: include=carrier,cnam.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://.signalwire.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async createVideoConference(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/video/conferences",
        method: "POST",
      });
    },
    async validatePhoneNumber(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: `/lookup/phone_number/${opts.e164Number}`,
      });
    },
    async listPhoneCallLogs(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/voice/logs",
      });
    },
    async listTextMessageLogs(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/messaging/logs",
      });
    },
    paginate(fn, ...opts) {
      const results = [];
      let page = 0;
      while (true) {
        const {
          items, next,
        } = fn(...opts, {
          page,
        });
        results.push(...items);
        if (!next) break;
        page++;
      }
      return results;
    },
  },
};
