import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "livestorm",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user.",
      async options({
        page, mapper = ({
          id: value, attributes: { email: label },
        }) => ({
          label,
          value,
        }),
      }) {
        const { data } = await this.listPeople({
          params: {
            ["page[number]"]: page,
          },
        });
        return data.map(mapper);
      },
    },
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The ID of the event.",
      async options({ page }) {
        const { data } = await this.listEvents({
          params: {
            ["page[number]"]: page,
          },
        });
        return data.map(({
          id: value, attributes: { title: label },
        }) => ({
          label,
          value,
        }));
      },
    },
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "The ID of the session.",
      async options({ page }) {
        const { data } = await this.listSessions({
          params: {
            ["page[number]"]: page,
          },
        });
        return data.map(({ id }) => id);
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the event.",
    },
    slug: {
      type: "string",
      label: "Slug",
      description: "The slug of the event.",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the event.",
      options: Object.values(constants.EVENT_STATUS),
    },
    description: {
      type: "string",
      label: "Description",
      description: "The [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) description of your event. Example: `<h1>My event description</h1>`",
    },
    recordingEnabled: {
      type: "boolean",
      label: "Recording Enabled",
      description: "Whether or not the event is recorded.",
    },
    chatEnabled: {
      type: "boolean",
      label: "Chat Enabled",
      description: "Whether or not the chat is enabled.",
    },
    everyoneCanSpeak: {
      type: "boolean",
      label: "Everyone Can Speak",
      description: "Whether or not everyone can speak.",
    },
    detailedRegistrationPageEnabled: {
      type: "boolean",
      label: "Detailed Registration Page Enabled",
      description: "Whether or not the detailed registration page is enabled.",
    },
    lightRegistrationPageEnabled: {
      type: "boolean",
      label: "Light Registration Page Enabled",
      description: "Whether or not the light registration page is enabled.",
    },
    recordingPublic: {
      type: "boolean",
      label: "Recording Public",
      description: "Whether or not the recording is public.",
    },
    showInCompanyPage: {
      type: "boolean",
      label: "Show In Company Page",
      description: "Whether or not the event is shown in the company page.",
    },
    pollsEnabled: {
      type: "boolean",
      label: "Polls Enabled",
      description: "Whether or not the polls are enabled.",
    },
    questionsEnabled: {
      type: "boolean",
      label: "Questions Enabled",
      description: "Whether or not the questions are enabled.",
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "accept": "application/vnd.api+json",
        "content-type": "application/vnd.api+json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, url, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        ...args,
      };

      return axios(step, config);
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    put(args = {}) {
      return this.makeRequest({
        method: "put",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
    patch(args = {}) {
      return this.makeRequest({
        method: "patch",
        ...args,
      });
    },
    listPeople(args = {}) {
      return this.makeRequest({
        path: "/people",
        ...args,
      });
    },
    listEvents(args = {}) {
      return this.makeRequest({
        path: "/events",
        ...args,
      });
    },
    listSessions(args = {}) {
      return this.makeRequest({
        path: "/sessions",
        ...args,
      });
    },
    getSession({
      sessionId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/sessions/${sessionId}`,
        ...args,
      });
    },
    getEvent({
      eventId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/events/${eventId}`,
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      max = constants.DEFAULT_MAX,
    }) {
      let page = 0;
      let resourcesCount = 0;

      while (true) {
        const {
          meta,
          data: nextResources,
        } =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              ...resourceFnArgs.params,
              ["page[number]"]: page,
            },
          });

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            return;
          }
        }

        if (!meta?.next_page) {
          console.log("No more pages found");
          return;
        }

        page += 1;
      }
    },
  },
};
