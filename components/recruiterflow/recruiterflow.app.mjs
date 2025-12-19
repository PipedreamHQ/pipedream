import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "recruiterflow",
  propDefinitions: {
    candidateId: {
      type: "string",
      label: "Candidate ID",
      description: "The ID of the candidate",
      async options({ page }) {
        const data = await this.listCandidates({
          params: {
            current_page: page + 1,
            items_per_page: constants.DEFAULT_LIMIT,
          },
        });
        return data?.map((candidate) => ({
          label: `${candidate.first_name} ${candidate.last_name}`,
          value: candidate.id,
        })) || [];
      },
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of the job",
      async options({ page }) {
        const data = await this.listJobs({
          params: {
            current_page: page + 1,
            items_per_page: constants.DEFAULT_LIMIT,
          },
        });
        return data?.map((job) => ({
          label: job.title,
          value: job.id,
        })) || [];
      },
    },
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The ID of the company",
      async options({ page }) {
        const data = await this.listCompanies({
          params: {
            current_page: page + 1,
            items_per_page: constants.DEFAULT_LIMIT,
          },
        });
        return data?.map((company) => ({
          label: company.name,
          value: company.id,
        })) || [];
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact",
      async options({ page }) {
        const data = await this.listContacts({
          params: {
            current_page: page + 1,
            items_per_page: constants.DEFAULT_LIMIT,
          },
        });
        return data?.map((contact) => ({
          label: `${contact.first_name} ${contact.last_name}`,
          value: contact.id,
        })) || [];
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      async options() {
        const { data } = await this.listUsers();
        return data?.map((user) => ({
          label: user.name || user.email,
          value: user.id,
        })) || [];
      },
    },
    locationId: {
      type: "string",
      label: "Location ID",
      description: "Location ID for the job",
      async options() {
        const { data } = await this.listLocations();
        return data?.map((location) => ({
          label: location.name,
          value: location.id,
        })) || [];
      },
    },
    departmentId: {
      type: "string",
      label: "Department ID",
      description: "The ID of the department",
      async options() {
        const { data } = await this.listDepartments();
        return data?.map((dept) => ({
          label: dept.name,
          value: dept.id,
        })) || [];
      },
    },
    employmentTypeId: {
      type: "string",
      label: "Employment Type ID",
      description: "The ID of the employment type",
      async options() {
        const { data } = await this.listEmploymentTypes();
        return data?.map((type) => ({
          label: type.name,
          value: type.id,
        })) || [];
      },
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: `Array of custom field objects.
Example:
\`\`\`json
[
  {
    "id": 16,
    "value": {"currency": "USD", "number": 600000}
  },
  {
    "id": 17,
    "value": {"currency": "USD", "number1": 600000, "number2": 800000}
  },
  {
    "id": 19,
    "value": {"number1": 600000, "number2": 800000}
  },
  {
    "id": 20,
    "value": ["choice1", "choice2"]
  },
  {
    "id" : 33,
    "value" : "Random"
  }
]
\`\`\`
See the [API documentation](https://recruiterflow.com/api) for more details.
      `,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.recruiterflow.com";
    },
    _headers() {
      return {
        "RF-Api-Key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createCandidate(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/external/candidate/add",
        ...opts,
      });
    },
    listCandidates(opts = {}) {
      return this._makeRequest({
        path: "/api/external/candidate/list",
        ...opts,
      });
    },
    searchCandidates(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/external/candidate/search",
        ...opts,
      });
    },
    addCandidateToJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/external/candidate/add-to-job",
        ...opts,
      });
    },
    moveCandidateToStage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/external/candidate/move-to-stage",
        ...opts,
      });
    },
    createJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/external/job/create",
        ...opts,
      });
    },
    listJobs(opts = {}) {
      return this._makeRequest({
        path: "/api/external/job/list",
        ...opts,
      });
    },
    getJobPipeline(opts = {}) {
      return this._makeRequest({
        path: "/api/external/job/pipeline",
        ...opts,
      });
    },
    createPlacement(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/external/placement-record/create",
        ...opts,
      });
    },
    listCompanies(opts = {}) {
      return this._makeRequest({
        path: "/api/external/client/list",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/api/external/contact/list",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/api/external/user/list",
        ...opts,
      });
    },
    listLocations(opts = {}) {
      return this._makeRequest({
        path: "/api/external/location/list",
        ...opts,
      });
    },
    listDepartments(opts = {}) {
      return this._makeRequest({
        path: "/api/external/job/department/list",
        ...opts,
      });
    },
    listEmploymentTypes(opts = {}) {
      return this._makeRequest({
        path: "/api/external/organization/employment-type/list",
        ...opts,
      });
    },
  },
};
