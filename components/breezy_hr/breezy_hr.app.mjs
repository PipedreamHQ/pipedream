import { axios } from "@pipedream/platform";

const BASE_URL = "https://api.breezy.hr/v3";

export default {
  type: "app",
  app: "breezy_hr",
  propDefinitions: {
    companyId: {
      type: "string",
      label: "Company",
      description: "The Breezy HR company",
      async options() {
        const rows = await this.listCompanies();
        return rows
          .map((c) => {
            const value = this._entityId(c);
            const label = c?.name || value || "Company";
            return {
              label,
              value,
            };
          })
          .filter((o) => o.value);
      },
    },
    positionId: {
      type: "string",
      label: "Position",
      description: "The position that contains the candidate. (This will only show published positions)",
      async options({ companyId }) {
        if (!companyId) {
          return [];
        }
        const rows = await this.listPositions({
          companyId,
        });
        return rows
          .map((p) => {
            const value = this._entityId(p);
            const label = p?.name || value || "Position";
            return {
              label,
              value,
            };
          })
          .filter((o) => o.value);
      },
    },
    candidateId: {
      type: "string",
      label: "Candidate",
      description: "The candidate to retrieve",
      async options({
        companyId, positionId,
      }) {
        if (!companyId || !positionId) {
          return [];
        }
        const rows = await this.listPositionCandidates({
          companyId,
          positionId,
        });
        return rows
          .map((c) => {
            const value = this._entityId(c);
            const parts = [
              c?.first_name,
              c?.last_name,
            ].filter(Boolean);
            const fullName = parts.join(" ");
            const label =
              c?.name || fullName || c?.email_address || value || "Candidate";
            return {
              label,
              value,
            };
          })
          .filter((o) => o.value);
      },
    },
  },
  methods: {
    _entityId(obj) {
      return obj?._id || obj?.id;
    },

    /**
     * Breezy list endpoints return a JSON array; normalize if wrapped.
     * @param {unknown} result
     * @returns {object[]}
     */
    _normalizeArray(result) {
      if (Array.isArray(result)) {
        return result;
      }
      if (Array.isArray(result?.data)) {
        return result.data;
      }
      return [];
    },

    _accessToken() {
      const auth = this.$auth;
      const token = auth.oauth_access_token;

      return typeof token === "string"
        ? token
        : String(token);
    },

    _headers() {
      return {
        Accept: "application/json",
        Authorization: this._accessToken(),
      };
    },

    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${BASE_URL}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },

    async listCompanies(opts = {}) {
      const result = await this._makeRequest({
        method: "get",
        path: "/companies",
        ...opts,
      });
      return this._normalizeArray(result);
    },

    /**
     * List positions for a company. See
     * https://developer.breezy.hr/reference/company-positions
     * @param {object} opts
     * @param {string} opts.companyId
     * @param {string} [opts.state] - `published` (default when omitted), or a
     *   specific state
     */
    async listPositions({
      companyId,
      state,
      ...opts
    }) {
      const mergedParams = {
        ...(opts.params || {}),
      };
      mergedParams.state =
        state === undefined || state === null || state === ""
          ? "published"
          : state;
      const result = await this._makeRequest({
        method: "get",
        path: `/company/${encodeURIComponent(companyId)}/positions`,
        ...opts,
        params: mergedParams,
      });
      return this._normalizeArray(result);
    },

    async listPositionCandidates({
      companyId, positionId, ...opts
    }) {
      const result = await this._makeRequest({
        method: "get",
        path:
          `/company/${encodeURIComponent(companyId)}/position/${encodeURIComponent(positionId)}/candidates`,
        ...opts,
      });
      return this._normalizeArray(result);
    },

    /**
     * Retrieve a candidate by ID for a position
     * @param {object} opts
     * @param {object} opts.$ - Pipedream execution context
     * @param {string} opts.companyId - Breezy company ID
     * @param {string} opts.positionId - Position ID
     * @param {string} opts.candidateId - Candidate ID
     * @returns {Promise<object>} Candidate resource from the API
     */
    async getCandidate({
      $, companyId, positionId, candidateId,
    }) {
      const res = await this._makeRequest({
        $,
        method: "get",
        path:
          `/company/${encodeURIComponent(companyId)}/position/${encodeURIComponent(positionId)}/candidate/${encodeURIComponent(candidateId)}`,
      });
      return res?.data ?? res;
    },
  },
};
