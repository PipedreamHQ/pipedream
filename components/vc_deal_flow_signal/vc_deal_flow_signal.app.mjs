import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "vc_deal_flow_signal",
  propDefinitions: {
    sector: {
      type: "string",
      label: "Sector",
      description: "Sector slug to filter on (e.g. `ai-ml`, `fintech`).",
      options: constants.SECTORS,
    },
    startupName: {
      type: "string",
      label: "Startup Name",
      description: "Display name or GitHub org slug. Case-insensitive.",
    },
    signalTypeFilter: {
      type: "string",
      label: "Signal Type Filter",
      description: "Optional enum filter for engineering-signal type. Accepts one of the SIGNAL_TYPES, e.g. 'Deploy frequency spike', 'Infrastructure buildout'.",
      optional: true,
      options: constants.SIGNAL_TYPES,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Max number of records to return.",
      optional: true,
      default: 50,
      min: 1,
      max: 200,
    },
  },
  methods: {
    _baseUrl() {
      return constants.BASE_URL;
    },
    async _request({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        method: "GET",
        headers: {
          "User-Agent": "@pipedream/gitdealflow",
          "Accept": "application/json",
        },
        ...opts,
      });
    },
    getSignals(opts = {}) {
      return this._request({
        path: "/api/signals.json",
        ...opts,
      });
    },
    getChangelog(opts = {}) {
      return this._request({
        path: "/api/changelog.json",
        ...opts,
      });
    },
    normalize(value) {
      return (value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    },
    buildSectorMap(sectors) {
      const map = {};
      for (const sector of sectors || []) {
        for (const startup of sector.startups || []) {
          if (startup?.name) map[startup.name] = sector.name;
        }
      }
      return map;
    },
    enrichStartup({
      startup, period, sectorName, citation, rank,
    }) {
      const name = startup?.name || "";
      return {
        rank: rank ?? null,
        period,
        name,
        sector: sectorName || "",
        stage: startup?.stage || "Unknown",
        geography: startup?.geography || "Unknown",
        commitVelocity14d: startup?.commitVelocity14d || 0,
        commitVelocityChange: startup?.commitVelocityChange || "",
        contributors: startup?.contributors || 0,
        contributorGrowth: startup?.contributorGrowth || "",
        newRepos: startup?.newRepos || 0,
        signalType: startup?.signalType || "",
        description: startup?.description || "",
        githubUrl: startup?.githubUrl || "",
        websiteUrl: startup?.websiteUrl || "",
        linkedinUrl: startup?.linkedinUrl || "",
        profileUrl: name
          ? `https://gitdealflow.com/startups-to-watch/${this.normalize(name)}`
          : "",
        citation: citation || "",
      };
    },
  },
};
