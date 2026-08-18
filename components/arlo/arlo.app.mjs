// x-pd-ai: optimized
import {
  XMLParser, XMLBuilder,
} from "fast-xml-parser";
import { axios } from "@pipedream/platform";
import {
  DEFAULT_LIMIT,
  MAX_LIMIT,
  MIN_LIMIT,
} from "./common/constants.mjs";

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  processEntities: {
    enabled: true,
    maxEntitySize: 1024 * 1024,
    maxExpansionDepth: 10,
    maxTotalExpansions: 1000,
    maxExpandedLength: 10 * 1024 * 1024,
    maxEntityCount: 100,
  },
  htmlEntities: true,
});

const xmlBuilder = new XMLBuilder({
  ignoreAttributes: false,
  suppressUnpairedNode: true,
});

export default {
  type: "app",
  app: "arlo",
  propDefinitions: {
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The integer ID of the Arlo event. Run **List Events** to find valid event IDs.",
    },
    registrationId: {
      type: "string",
      label: "Registration ID",
      description: "The integer ID of the registration. Run **List Registrations** to find valid registration IDs.",
    },
    presenterId: {
      type: "string",
      label: "Presenter ID",
      description: "The integer contact ID of the presenter. Run **List Presenters** to find valid presenter IDs.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The contact's first name (max 32 characters).",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's last name (max 32 characters).",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email address (max 128 characters).",
    },
    phoneWork: {
      type: "string",
      label: "Work Phone",
      description: "Optional work phone number (max 32 characters).",
      optional: true,
    },
    phoneMobile: {
      type: "string",
      label: "Mobile Phone",
      description: "Optional mobile phone number (max 32 characters).",
      optional: true,
    },
    phoneHome: {
      type: "string",
      label: "Home Phone",
      description: "Optional home phone number (max 32 characters).",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of records to return per page. Min ${MIN_LIMIT}, max ${MAX_LIMIT}. Defaults to ${DEFAULT_LIMIT}. If the response returns exactly this many records, more may exist — call again with a higher \`skip\` to page through.`,
      optional: true,
      min: MIN_LIMIT,
      max: MAX_LIMIT,
      default: DEFAULT_LIMIT,
    },
    skip: {
      type: "integer",
      label: "Skip",
      description: "Number of records to skip, for paging past the first page. Defaults to 0 (start at the beginning). Set to `limit` from the previous call to fetch the next page, `2 * limit` for the page after that, and so on.",
      optional: true,
      min: 0,
      default: 0,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.subdomain}.arlo.co/api/2012-02-01/auth/resources`;
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...args
    }) {
      const response = await axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: {
          username: `${this.$auth.email}`,
          password: `${this.$auth.password}`,
        },
        headers,
        ...args,
      });
      return typeof response === "string"
        ? xmlParser.parse(response)
        : response;
    },
    _unwrapItem(response, key) {
      return response?.[key] ?? response;
    },
    _extractCollection(response, collectionKey, itemKey) {
      const links = response?.[collectionKey]?.Link;
      const list = Array.isArray(links)
        ? links
        : links
          ? [
            links,
          ]
          : [];
      return list
        .filter((link) => link?.[itemKey])
        .map((link) => link[itemKey]);
    },
    _shapeItems(items, fields) {
      if (!fields?.length) {
        return items;
      }
      return items.map((item) => Object.fromEntries(
        fields
          .filter((field) => field in item)
          .map((field) => [
            field,
            item[field],
          ]),
      ));
    },
    _writeRequest({
      $, rootTag, ...args
    }) {
      const {
        data, ...rest
      } = args;
      return this._makeRequest({
        $,
        ...rest,
        data: xmlBuilder.build({
          [rootTag]: data,
        }),
        headers: {
          "Content-Type": "application/xml",
        },
      });
    },
    _patchRequest({
      $, rootTag, path, data,
    }) {
      const replace = Object.entries(data)
        .filter(([
          , value,
        ]) => value !== undefined && value !== null)
        .map(([
          field,
          value,
        ]) => ({
          "@_sel": `${rootTag}/${field}/text()`,
          "#text": String(value),
        }));
      return this._makeRequest({
        $,
        method: "PATCH",
        path,
        data: xmlBuilder.build({
          diff: {
            replace,
          },
        }),
        headers: {
          "Content-Type": "application/xml",
        },
      });
    },
    async listEventTemplates({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "/eventtemplates",
        params,
      });
    },
    async listEvents({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "/events",
        params,
      });
    },
    async getEvent({
      $, eventId,
    }) {
      return this._makeRequest({
        $,
        path: `/events/${eventId}`,
      });
    },
    async createEventImportRequest({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/events/importrequests",
        data: {
          Requests: [
            data,
          ],
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    async listRegistrations({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "/registrations",
        params,
      });
    },
    async getRegistration({
      $, registrationId,
    }) {
      return this._makeRequest({
        $,
        path: `/registrations/${registrationId}`,
        params: {
          expand: "Contact",
        },
      });
    },
    async listContacts({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "/contacts",
        params,
      });
    },
    async createContact({
      $, data,
    }) {
      return this._writeRequest({
        $,
        rootTag: "Contact",
        method: "POST",
        path: "/contacts",
        data,
      });
    },
    async updateContact({
      $, contactId, data,
    }) {
      return this._patchRequest({
        $,
        rootTag: "Contact",
        path: `/contacts/${contactId}`,
        data,
      });
    },
    async listVenues({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "/venues",
        params,
      });
    },
  },
};
