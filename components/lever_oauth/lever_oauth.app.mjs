import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lever_oauth",
  propDefinitions: {
    opportunityId: {
      type: "string",
      label: "Opportunity ID",
      description: "The ID of the opportunity. Use **Search Opportunities** to find opportunity IDs.",
    },
    performAs: {
      type: "string",
      label: "Perform As (User ID)",
      description: "User ID of the person performing this action — recorded in the audit trail. Use **List Users** to find user IDs.",
    },
    expand: {
      type: "string[]",
      label: "Expand",
      description: "Inline related objects in the response to avoid follow-up calls.",
      optional: true,
      options: [
        "applications",
        "stage",
        "owner",
        "followers",
        "sourcedBy",
        "contact",
        "offers",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of items to return (1–100). Defaults to 100.",
      optional: true,
      default: 100,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.lever.co/v1";
    },
    _makeRequest({
      $ = this, path, headers = {}, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          ...headers,
        },
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    listPostings(opts = {}) {
      return this._makeRequest({
        path: "/postings",
        ...opts,
      });
    },
    createPosting(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/postings",
        ...opts,
      });
    },
    listStages(opts = {}) {
      return this._makeRequest({
        path: "/stages",
        ...opts,
      });
    },
    listArchiveReasons(opts = {}) {
      return this._makeRequest({
        path: "/archive_reasons",
        ...opts,
      });
    },
    listOpportunities(opts = {}) {
      return this._makeRequest({
        path: "/opportunities",
        ...opts,
      });
    },
    getOpportunity(opportunityId, opts = {}) {
      return this._makeRequest({
        path: `/opportunities/${opportunityId}`,
        ...opts,
      });
    },
    createOpportunity(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/opportunities",
        ...opts,
      });
    },
    updateOpportunityStage(opportunityId, opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/opportunities/${opportunityId}/stage`,
        ...opts,
      });
    },
    archiveOpportunity(opportunityId, opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/opportunities/${opportunityId}/archived`,
        ...opts,
      });
    },
    listNotes(opportunityId, opts = {}) {
      return this._makeRequest({
        path: `/opportunities/${opportunityId}/notes`,
        ...opts,
      });
    },
    addNote(opportunityId, opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/opportunities/${opportunityId}/notes`,
        ...opts,
      });
    },
    listFeedback(opportunityId, opts = {}) {
      return this._makeRequest({
        path: `/opportunities/${opportunityId}/feedback`,
        ...opts,
      });
    },
    submitFeedback(opportunityId, opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/opportunities/${opportunityId}/feedback`,
        ...opts,
      });
    },
    listInterviews(opportunityId, opts = {}) {
      return this._makeRequest({
        path: `/opportunities/${opportunityId}/interviews`,
        ...opts,
      });
    },
    createInterview(opportunityId, opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/opportunities/${opportunityId}/interviews`,
        ...opts,
      });
    },
    getOffer(opportunityId, opts = {}) {
      return this._makeRequest({
        path: `/opportunities/${opportunityId}/offers`,
        ...opts,
      });
    },
    listFiles(opportunityId, opts = {}) {
      return this._makeRequest({
        path: `/opportunities/${opportunityId}/files`,
        ...opts,
      });
    },
    uploadFile(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/uploads",
        ...opts,
      });
    },
    getResume(opportunityId, resumeId, opts = {}) {
      return this._makeRequest({
        path: `/opportunities/${opportunityId}/resumes/${resumeId}`,
        ...opts,
      });
    },
  },
};
