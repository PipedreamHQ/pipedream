import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "ortto",
  propDefinitions: {
    email: {
      type: "string",
      label: "Person's Email",
      description: "A string whose value is this person’s email address.",
      async options({ prevContext }) {
        const {
          contacts,
          next_offset: offset,
        } = await this.listPeople({
          data: {
            limit: constants.DEFAULT_LIMIT,
            offset: prevContext.offset,
            fields: [
              constants.FIELD.EMAIL,
              constants.FIELD.FIRST_NAME,
              constants.FIELD.LAST_NAME,
            ],
          },
        });
        const options =
          contacts.map(({ fields }) => {
            const {
              [constants.FIELD.EMAIL]: email,
              [constants.FIELD.FIRST_NAME]: firstName,
              [constants.FIELD.LAST_NAME]: lastName,
            } = fields;
            const name = [
              firstName,
              lastName,
            ].join(" ").trim();
            return {
              label: name || email,
              value: email,
            };
          });
        return {
          options,
          context: {
            offset,
          },
        };
      },
    },
  },
  methods: {
    getBaseUrl() {
      return `https://${this.$auth.region}${constants.VERSION_PATH}`;
    },
    getUrl(path) {
      return `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "X-Api-Key": this.$auth.api_key,
        ...headers,
      };
    },
    async makeRequest({
      step = this, path, headers, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path),
        ...args,
      };

      try {
        return await axios(step, config);
      } catch (error) {
        console.log("Error", error);
        throw error;
      }
    },
    listPeople(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/person/get",
        ...args,
      });
    },
    listPeopleSubscriptions(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/person/subscriptions",
        ...args,
      });
    },
    mergePeople(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/person/merge",
        ...args,
      });
    },
    createActivity(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/activities/create",
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourcesName = "contacts",
      maxResources = constants.MAX_RESOURCES,
    }) {
      let offset;
      let resourcesCount = 0;

      while (true) {
        const {
          [resourcesName]: nextResources,
          next_offset: nextOffset,
          has_more: hasMore,
        } =
          await resourceFn({
            ...resourceFnArgs,
            data: {
              ...resourceFnArgs.data,
              offset,
            },
          });

        if (!nextResources?.length) {
          return;
        }

        if (nextOffset) {
          offset = nextOffset;
        }

        for (const resource of nextResources) {
          if (resourcesCount >= maxResources) {
            return;
          }

          yield resource;

          resourcesCount += 1;
        }

        if (!hasMore || (resourcesCount >= maxResources)) {
          return;
        }
      }
    },
  },
};
