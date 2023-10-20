import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "recruit_crm",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The contact ID.",
      optional: true,
      options({
        mapper = this.getEntityMetadata().contact.mapper,
        ...args
      }) {
        return this.listOptions({
          resourcesFn: this.getEntityMetadata().contact.resourcesFn,
          mapper,
          ...args,
        });
      },
    },
    candidateId: {
      type: "string",
      label: "Candidate ID",
      description: "The candidate ID.",
      optional: true,
      options({
        mapper = this.getEntityMetadata().candidate.mapper,
        ...args
      }) {
        return this.listOptions({
          resourcesFn: this.getEntityMetadata().candidate.resourcesFn,
          mapper,
          ...args,
        });
      },
    },
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The company ID.",
      optional: true,
      options({
        mapper = this.getEntityMetadata().company.mapper,
        ...args
      }) {
        return this.listOptions({
          resourcesFn: this.getEntityMetadata().company.resourcesFn,
          mapper,
          ...args,
        });
      },
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The job ID.",
      optional: true,
      options({
        mapper = this.getEntityMetadata().job.mapper,
        ...args
      }) {
        return this.listOptions({
          resourcesFn: this.getEntityMetadata().job.resourcesFn,
          mapper,
          ...args,
        });
      },
    },
    dealId: {
      type: "string",
      label: "Deal ID",
      description: "The deal ID.",
      optional: true,
      options({
        mapper = this.getEntityMetadata().deal.mapper,
        ...args
      }) {
        return this.listOptions({
          resourcesFn: this.getEntityMetadata().deal.resourcesFn,
          mapper,
          ...args,
        });
      },
    },
    reminder: {
      type: "string",
      label: "Reminder",
      description: "The reminder of the meeting in minutes. Example: `30`",
      options: constants.REMINDER_OPTIONS,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date and time of the meeting. Example: `2020-06-29T05:36:22.000000Z`",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the meeting",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the meeting",
      optional: true,
    },
    relatedToType: {
      type: "string",
      label: "Related To Type",
      description: "Associated entity's type. Example: `candidate`",
      optional: true,
      options: constants.RELATED_TO_TYPES,
    },
    relatedTo: {
      type: "string",
      label: "Related To",
      description: "Associated entity's slug. Example: `23123`",
      optional: true,
      options({
        relatedToType,
        ...args
      }) {
        if (!relatedToType) {
          return [];
        }
        const {
          [relatedToType]: {
            resourcesFn,
            mapper,
          },
        } = this.getEntityMetadata("slug");

        return this.listOptions({
          resourcesFn,
          mapper,
          ...args,
        });
      },
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path) {
      return `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_token}`,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, data, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path),
        data: utils.dataToCommaSeparatedList(utils.keysToSnakeCase(data)),
        ...args,
      };

      return axios(step, config);
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
    listContacts(args = {}) {
      return this.makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    listCandidates(args = {}) {
      return this.makeRequest({
        path: "/candidates",
        ...args,
      });
    },
    listCompanies(args = {}) {
      return this.makeRequest({
        path: "/companies",
        ...args,
      });
    },
    listJobs(args = {}) {
      return this.makeRequest({
        path: "/jobs",
        ...args,
      });
    },
    listDeals(args = {}) {
      return this.makeRequest({
        path: "/deals",
        ...args,
      });
    },
    listTasks(args = {}) {
      return this.makeRequest({
        path: "/tasks",
        ...args,
      });
    },
    getEntityMetadata(valueKey = "id") {
      return {
        contact: {
          resourcesFn: this.listContacts,
          mapper: ({
            [valueKey]: value, first_name: label,
          }) => ({
            label,
            value,
          }),
        },
        candidate: {
          resourcesFn: this.listCandidates,
          mapper: ({
            [valueKey]: value, first_name: label,
          }) => ({
            label,
            value,
          }),
        },
        company: {
          resourcesFn: this.listCompanies,
          mapper: ({
            [valueKey]: value, company_name: label,
          }) => ({
            label,
            value,
          }),
        },
        job: {
          resourcesFn: this.listJobs,
          mapper: ({
            [valueKey]: value, name: label,
          }) => ({
            label,
            value,
          }),
        },
        deal: {
          resourcesFn: this.listDeals,
          mapper: ({
            [valueKey]: value, name: label,
          }) => ({
            label,
            value,
          }),
        },
      };
    },
    async listOptions({
      page, resourcesFn, mapper,
    }) {
      const { data } = await resourcesFn({
        params: {
          page,
        },
      });
      return data.map(mapper);
    },
  },
};
