import { axios } from "@pipedream/platform";
import {
  DEFAULT_LIMIT,
  DOCUMENT_SCOPES,
  MAX_LIMIT,
  MOTION_TYPES,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "court_rules",
  propDefinitions: {
    districtId: {
      type: "string",
      label: "Court ID",
      description: "The identifier of the court, e.g. `edny` or `ca-los-angeles-superior`. Use **List Courts** to find it (the `district_id` field). Only courts with rules available (status `live`) are offered as options.",
      async options() {
        const { courts } = await this.listCourts();
        return courts
          .filter(({ status }) => status === "live")
          .map(({
            district_id: districtId, name,
          }) => ({
            label: `${name} (${districtId})`,
            value: districtId,
          }));
      },
    },
    judgeSlug: {
      type: "string",
      label: "Judge Slug",
      description: "The slug of a judge, calendar, department or courtroom, e.g. `nicholas-g-garaufis`. Use **List Judges** with the same court ID to find it (the `slug` field). It must belong to the court given in Court ID.",
      async options({ districtId }) {
        if (!districtId) {
          return [];
        }
        const { judges } = await this.listJudges({
          params: {
            district_id: districtId,
          },
        });
        return judges.map(({
          slug, name,
        }) => ({
          label: name,
          value: slug,
        }));
      },
    },
    nameFilter: {
      type: "string",
      label: "Name Filter",
      description: "Only return entries whose name contains this text, ignoring case, e.g. `garaufis`.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of results to return, e.g. \`50\`. Defaults to \`${DEFAULT_LIMIT}\`. The maximum is \`${MAX_LIMIT}\`.`,
      min: 1,
      max: MAX_LIMIT,
      default: DEFAULT_LIMIT,
      optional: true,
    },
    documentScope: {
      type: "string",
      label: "Document Scope",
      description: "The type of document being filed, e.g. `brief_support` for a memorandum in support of a motion. Other values include `brief_opposition`, `brief_reply`, `letter` and `affidavit`.",
      options: DOCUMENT_SCOPES,
    },
    motionType: {
      type: "string",
      label: "Motion Type",
      description: "The kind of motion the document relates to, e.g. `Rule_56` for summary judgment. Other values include `Rule_12`, `Daubert`, `TRO` and `general`. Leave empty if the filing is not motion-related.",
      options: MOTION_TYPES,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.courtrules.app/api/v1";
    },
    _headers(headers = {}) {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        url: path,
        headers: this._headers(headers),
        ...args,
      });
    },
    listCourts(args = {}) {
      return this._makeRequest({
        path: "/courts",
        ...args,
      });
    },
    listJudges(args = {}) {
      return this._makeRequest({
        path: "/judges",
        ...args,
      });
    },
    getRules(args = {}) {
      return this._makeRequest({
        path: "/rules",
        ...args,
      });
    },
    listExtractedRules(args = {}) {
      return this._makeRequest({
        path: "/extracted-rules",
        ...args,
      });
    },
    listCourtHolidays(args = {}) {
      return this._makeRequest({
        path: "/holidays",
        ...args,
      });
    },
    checkDocument(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/check",
        ...args,
      });
    },
  },
};
