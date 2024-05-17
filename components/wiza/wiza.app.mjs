import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "wiza",
  propDefinitions: {
    acceptWork: {
      type: "boolean",
      label: "Work Email",
      description: "Accept professional email address? i.e. 'tim.cooke@apple.com'",
    },
    acceptPersonal: {
      type: "boolean",
      label: "Personal Email",
      description: "Accept personal email address? i.e. 'tcooke1960@gmail.com'",
    },
    acceptGeneric: {
      type: "boolean",
      label: "Generic Email",
      description: "Accept generic email address? i.e. 'hello@apple.com'",
    },
    enrichmentLevel: {
      type: "string",
      label: "Enrichment Level",
      description: "Enrichment level of the list.",
      options: constants.ENRICHMENT_LEVELS,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the list",
    },
    fullName: {
      type: "string",
      label: "Full Name",
      description: "Full name of the contact",
    },
    company: {
      type: "string",
      label: "Company",
      description: "Name of the company",
    },
    id: {
      type: "string",
      label: "List ID",
      description: "ID of the list",
    },
    segment: {
      type: "string",
      label: "Segment",
      description: "Specify the segment of contacts to return",
      options: constants.SEGMENTS,
    },
  },
  methods: {
    _baseUrl() {
      return "https://wiza.co/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async getList({
      args, id,
    }) {
      return this._makeRequest({
        path: `/lists/${id}`,
        ...args,
      });
    },
    async getContacts({
      id, ...args
    }) {
      return this._makeRequest({
        path: `/lists/${id}/contacts`,
        ...args,
      });
    },
    async createList(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/lists",
        ...args,
      });
    },
  },
};
