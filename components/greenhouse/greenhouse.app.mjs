import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "greenhouse",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User Id",
      description: "The identification of the user who is registering.",
      async options({ page }) {
        const data = await this.listUsers({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The person's first name.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The person's last name.",
    },
    company: {
      type: "string",
      label: "Company",
      description: "The person's company.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The person's title.",
    },
    phoneNumbers: {
      type: "string[]",
      label: "Phone Numbers",
      description: "A list of phone numbers. The phone number includes a plus sign (+), then country code, city code, and local phone number.",
    },
    addressses: {
      type: "string[]",
      label: "Addressses",
      description: "A list of addresses.",
    },
    emailAddresses: {
      type: "string[]",
      label: "Email Addresses",
      description: "A list of email addresses.",
    },
    websiteAddresses: {
      type: "string[]",
      label: "Website Addresses",
      description: "A list of website addresses .",
    },
    socialMediaAddresses: {
      type: "string[]",
      label: "Social Media Addresses",
      description: "A list of social media addresses.",
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "A list of tags as strings.",
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "An object containing new custom field values. The fields are the custom field Id.",
    },
    recruiterEmail: {
      type: "string",
      label: "Recruiter Email",
      description: "The email of the recruiter - either id or email must be present.",
    },
    coordinatorEmail: {
      type: "string",
      label: "Coordinator Email",
      description: "The email of the coordinator - either id or email must be present.",
    },
    jobIds: {
      type: "string[]",
      label: "Job Ids",
      description: "An array of job ids to which the person will be assigned.",
      async options({ page }) {
        const data = await this.listJobs({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    educations: {
      type: "string[]",
      label: "Educations",
      description: "A list of education records.",
      async options() {
        const data = await this.listDegrees();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    candidateId: {
      type: "string",
      label: "Candidate ID",
      description: "The ID of the candidate whose application or status changes.",
      async options({ page }) {
        const data = await this.listCandidates({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, first_name: firstName, last_name: lastName,
        }) => ({
          label: `${firstName} ${lastName}`,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://harvest.greenhouse.io/v1";
    },
    _auth() {
      return {
        "username": `${this.$auth.api_key}`,
        "password": "",
      };
    },
    _makeRequest({
      $ = this, path, headers = {}, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        auth: this._auth(),
        headers,
        ...opts,
      });
    },
    createCandidate(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/candidates",
        ...opts,
      });
    },
    createProspect(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/prospects",
        ...opts,
      });
    },
    listApplications(opts = {}) {
      return this._makeRequest({
        path: "/applications",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    listInterviews(opts = {}) {
      return this._makeRequest({
        path: "/scheduled_interviews",
        ...opts,
      });
    },
    listJobs(opts = {}) {
      return this._makeRequest({
        path: "/jobs",
        ...opts,
      });
    },
    listDegrees(opts = {}) {
      return this._makeRequest({
        path: "/degrees",
        ...opts,
      });
    },
    listCandidates(opts = {}) {
      return this._makeRequest({
        path: "/candidates",
        ...opts,
      });
    },
    getActivity(candidateId) {
      return this._makeRequest({
        path: `/candidates/${candidateId}/activity_feed`,
      });
    },
    addAttachmentToCandidate({
      candidateId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/candidates/${candidateId}/attachments`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const data = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
