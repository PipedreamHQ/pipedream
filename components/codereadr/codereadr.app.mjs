import { xml2json } from "xml2json-light";
import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "codereadr",
  propDefinitions: {
    status: {
      type: "string[]",
      label: "Status",
      description: "Filter scans by status",
      options: [
        {
          label: "Valid",
          value: "1",
        },
        {
          label: "Invalid",
          value: "0",
        },
        {
          label: "Not Validated Due To Lost Internet Connectivity",
          value: "-1",
        },
      ],
    },
    databaseId: {
      type: "string",
      label: "Database ID",
      description: "Select the database to add or update a barcode value",
      async options() {
        const { database } = await this.listDatabases();
        return database.map((db) => ({
          label: db.name,
          value: db.id,
        }));
      },
    },
    value: {
      type: "string",
      label: "Value",
      description: "A string which specifies your desired barcode value. Must be 100 characters or less.",
    },
  },
  methods: {
    getUrl(subdomain = constants.SUBDOMAIN.API) {
      const baseUrl = constants.BASE_URL.replace(
        constants.SUBDOMAIN_PLACEHOLDER,
        subdomain,
      );
      return `${baseUrl}${constants.VERSION_PATH}`;
    },
    getAuthParams(params) {
      return {
        api_key: this.$auth.api_key,
        ...params,
      };
    },
    async _makeRequest({
      $ = this, params, subdomain, xmlOutput = false, onlyXml = false, ...args
    } = {}) {
      const {
        getUrl,
        getAuthParams,
      } = this;

      const config = {
        url: getUrl(subdomain),
        params: getAuthParams(params),
        ...args,
      };

      const xmlResponse = await axios($, config);

      if (onlyXml) {
        return xmlResponse;
      }

      try {
        const response = xml2json(xmlResponse);
        const data = response.xml || response;

        return !xmlOutput
          ? data
          : {
            ...data,
            xmlResponse,
          };

      } catch (error) {
        const msg = "Error converting XML response to JSON";
        console.log(msg, error);
        throw new Error(`${msg}: ${xmlResponse}`);
      }
    },
    create({
      params, ...args
    } = {}) {
      return this._makeRequest({
        params: {
          ...params,
          action: "create",
        },
        ...args,
      });
    },
    retrieve({
      params, ...args
    } = {}) {
      return this._makeRequest({
        params: {
          ...params,
          action: "retrieve",
        },
        ...args,
      });
    },
    generate({
      params, ...args
    } = {}) {
      return this._makeRequest({
        params: {
          ...params,
          action: "generate",
        },
        ...args,
      });
    },
    upsertvalue({
      params, ...args
    } = {}) {
      return this._makeRequest({
        params: {
          ...params,
          action: "upsertvalue",
        },
        ...args,
      });
    },
    listDatabases({
      params, ...args
    } = {}) {
      return this.retrieve({
        params: {
          ...params,
          section: "databases",
        },
        ...args,
      });
    },
    listScans({
      params, ...args
    } = {}) {
      return this.retrieve({
        params: {
          ...params,
          section: "scans",
        },
        ...args,
      });
    },
    async *getIterations({
      resourceFn,
      resourceFnArgs,
      resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let offset = 0;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              ...resourceFnArgs?.params,
              limit: constants.DEFAULT_MAX,
              offset,
            },
          });

        const nextResources = resourceName && response[resourceName] || response;

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

        offset += constants.DEFAULT_LIMIT;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
