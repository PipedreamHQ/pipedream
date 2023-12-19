import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "recruitee",
  propDefinitions: {
    candidateId: {
      type: "integer",
      label: "Candidate ID",
      description: "The candidate unique identifier",
      optional: true,
      async options() {
        const { candidates } = await this.listCandidates();
        return candidates.map((candidate) => ({
          label: candidate.name,
          value: candidate.id,
        }));
      },
    },
  },
  methods: {
    _apiEndpoint() {
      return "https://api.recruitee.com";
    },
    _authorization() {
      return `Bearer ${this.$auth.api_token}`;
    },
    _companyId() {
      return this.$auth.company_id;
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiEndpoint()}${path}`,
        ...args,
        headers: {
          ...args.headers,
          Authorization: this._authorization(),
        },
      });
    },
    listCandidates(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: `/c/${this.$auth.company_id}/candidates`,
        ...args,
      });
    },
    createTask(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/c/${this._companyId()}/tasks`,
        ...args,
      });
    },
    createNote(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/c/${this._companyId()}/candidates/${args.candidateId}/notes`,
        ...args,
      });
    },
    createCandidate(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/c/${this._companyId()}/candidates`,
        ...args,
      });
    },
  },
};
