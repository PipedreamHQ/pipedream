import {
  XMLParser, XMLBuilder,
} from "fast-xml-parser";
import { axios } from "@pipedream/platform";

const parser = new XMLParser({
  ignoreAttributes: false,
});

const builder = new XMLBuilder({
  ignoreAttributes: false,
  suppressUnpairedNode: true,
});

export default {
  type: "app",
  app: "jenkins",
  propDefinitions: {
    jobName: {
      type: "string",
      label: "Job Name",
      description: "The name of the Jenkins job to monitor for status updates.",
      async options() {
        const { jobs } = await this.getApiInfo();
        return jobs.map(({ name }) => name);
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${this.$auth.api_url}${path}`;
    },
    getAuth() {
      const {
        api_token: password,
        username,
      } = this.$auth;
      return {
        username,
        password,
      };
    },
    async _makeRequest({
      $ = this, path, data, headers, ...args
    } = {}) {
      const hasXmlHeader = headers?.["Content-Type"]?.includes("xml");
      let response;

      try {
        response = await axios($, {
          ...args,
          headers,
          url: this.getUrl(path),
          auth: this.getAuth(),
          data: hasXmlHeader
            ? data && builder.build(data) || undefined
            : data,
        });

      } catch (error) {
        console.log("Error:", error);
        throw error;
      }

      return hasXmlHeader
        ? parser.parse(response)
        : response;
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    getApiInfo(args = {}) {
      return this._makeRequest({
        path: "/api/json",
        ...args,
      });
    },
  },
};
