// x-pd-ai: optimized
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ionos_hosting_services",
  propDefinitions: {
    zoneId: {
      type: "string",
      label: "Zone ID",
      description: "The DNS zone ID (UUID format, e.g. `4ab3a7e2-1234-5678-abcd-ef0123456789`). Run **List DNS Zones** to retrieve available zones; use the `id` field from each returned object — not the `name` field (e.g. `example.com`) or the `type` field.",
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The DNS record ID (UUID format, e.g. `90d81ac0-3a30-44d4-95a5-12959effa6ee`). Run **Get DNS Zone** first to obtain a valid record ID from the zone's `records` array — use the `id` field of each record object.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.hosting.ionos.com/dns/v1";
    },
    _headers() {
      return {
        "x-api-key": `${this.$auth.public_prefix}.${this.$auth.secret}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...this._headers(),
          ...headers,
        },
        ...args,
      });
    },
    listZones(args = {}) {
      return this._makeRequest({
        path: "/zones",
        ...args,
      });
    },
    getZone({
      zoneId, ...args
    }) {
      return this._makeRequest({
        path: `/zones/${zoneId}`,
        ...args,
      });
    },
    updateZone({
      zoneId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/zones/${zoneId}`,
        ...args,
      });
    },
    patchZone({
      zoneId, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/zones/${zoneId}`,
        ...args,
      });
    },
    createRecords({
      zoneId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/zones/${zoneId}/records`,
        ...args,
      });
    },
    getRecord({
      zoneId, recordId, ...args
    }) {
      return this._makeRequest({
        path: `/zones/${zoneId}/records/${recordId}`,
        ...args,
      });
    },
    updateRecord({
      zoneId, recordId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/zones/${zoneId}/records/${recordId}`,
        ...args,
      });
    },
    deleteRecord({
      zoneId, recordId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/zones/${zoneId}/records/${recordId}`,
        ...args,
      });
    },
  },
};
