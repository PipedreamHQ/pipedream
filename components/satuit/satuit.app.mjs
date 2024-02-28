import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "satuit",
  propDefinitions: {
    business: {
      type: "string",
      label: "Business ID",
      description: "The ID of the business",
      async options({
        mapper = ({
          ["pbus.ibuskey"]: value,
          ["pbus.cbusiness"]: label,
        }) => ({
          label,
          value: String(value),
        }),
      }) {
        const { Result: data } = await this.getBusinesses({
          params: {
            top: 20,
            fields: "pbus.ibuskey,pbus.crep,pbus.cbusiness",
            orderby: {
              ["pbus.ibuskey"]: "desc",
            },
          },
        });
        return data.map(mapper);
      },
    },
    rep: {
      type: "string",
      label: "Rep ID",
      description: "The ID of the rep",
      async options({ mapper = ({ crep: value }) => value }) {
        const { Result: data } = await this.getReps();
        return data.map(mapper);
      },
    },
  },
  methods: {
    getUrl(path) {
      const {
        environment,
        sitename,
      } = this.$auth;

      const baseUrl = `${constants.BASE_URL}${constants.VERSION_PATH}`
        .replace(constants.ENV_PLACEHOLDER, environment)
        .replace(constants.SITENAME_PLACEHOLDER, sitename);

      return `${baseUrl}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        debug: true,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    createActivity(args = {}) {
      return this.post({
        path: "/activities",
        ...args,
      });
    },
    createContact(args = {}) {
      return this.post({
        path: "/contacts",
        ...args,
      });
    },
    createOpportunity(args = {}) {
      return this.post({
        path: "/opportunities",
        ...args,
      });
    },
    getBusinesses(args = {}) {
      return this._makeRequest({
        path: "/business",
        ...args,
      });
    },
    getReps(args = {}) {
      return this._makeRequest({
        path: "/rep",
        ...args,
      });
    },
    getContact(args = {}) {
      return this._makeRequest({
        path: "/contact",
        ...args,
      });
    },
    getOpportunity(args = {}) {
      return this._makeRequest({
        path: "/opportunity",
        ...args,
      });
    },
    getActivity(args = {}) {
      return this._makeRequest({
        path: "/activity",
        ...args,
      });
    },
    async *getIterations({
      resourcesFn, resourcesFnArgs, resourceName,
      fieldId, lastId,
      max = constants.DEFAULT_MAX,
    }) {
      let page = 1;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourcesFn({
            ...resourcesFnArgs,
            params: {
              ...resourcesFnArgs?.params,
              page,
            },
          });

        const nextResources = resourceName && response[resourceName] || response;

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          const idFound = lastId && resource[fieldId] === lastId;

          if (idFound) {
            console.log("Reached the last ID");
            return;
          }

          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            return;
          }
        }

        if (nextResources.length < constants.DEFAULT_LIMIT) {
          console.log("Reached the end of the resources");
          return;
        }

        page += 1;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
