import { axios } from "@pipedream/platform";
import constants from "./actions/common/constants.mjs";
import dayjs from "dayjs";

export default {
  type: "app",
  app: "demio",
  propDefinitions: {
    eventId: {
      label: "Event ID",
      description: "The ID of the event",
      type: "string",
      async options() {
        const events = await this.getAllTypeEvents();

        return events.map((event) => ({
          label: event.name,
          value: event.id,
        }));
      },
    },
    dateId: {
      label: "Date ID",
      description: "The ID of a scheduled date in the event",
      type: "string",
      async options({ eventId }) {
        const { dates } = await this.getEvent({
          eventId,
        });

        return dates?.map((date) => ({
          label: dayjs(date.timestamp * 1000).format("YYYY-MM-DD hh:mm:ss"),
          value: date.date_id,
        }));
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiKeySecret() {
      return this.$auth.api_secret;
    },
    _baseApiUrl() {
      return "https://my.demio.com/api/v1";
    },
    async _makeRequest(path, options = {}, $ = this) {
      return axios($, {
        url: `${this._baseApiUrl()}/${path}`,
        headers: {
          "Api-Key": this._apiKey(),
          "Api-Secret": this._apiKeySecret(),
        },
        ...options,
      });
    },
    async getAllTypeEvents() {
      let events = [];

      for (const type of constants.EVENT_TYPES) {
        events = events.concat(await this.getEvents({
          params: {
            type,
          },
        }));
      }

      return events;
    },
    async getEvents({
      $, params,
    }) {
      return this._makeRequest("events", {
        params,
      }, $);
    },
    async getEvent({
      $, eventId,
    }) {
      return this._makeRequest(`event/${eventId}`, {}, $);
    },
    async createJoinLink({
      $, data,
    }) {
      return this._makeRequest("event/register", {
        method: "put",
        data,
      }, $);
    },
    async getEventDateParticipants({
      $, dateId,
    }) {
      const response = await this._makeRequest(`report/${dateId}/participants`, {}, $);

      return response?.participants;
    },
  },
};
