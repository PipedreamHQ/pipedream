import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "prodpad",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "The name of the company",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address",
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the company",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the company. This should be a two letter country code. [See the ISO 3166 1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Decoding_table).",
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "The external id",
      optional: true,
    },
    externalUrl: {
      type: "string",
      label: "External URL",
      description: "The external url",
      optional: true,
    },
    companySize: {
      type: "string",
      label: "Size",
      description: "The size of the company.",
      optional: true,
      options: [
        {
          label: "1-10",
          value: "1_10",
        },
        {
          label: "11-50",
          value: "11_50",
        },
        {
          label: "50-250",
          value: "50_250",
        },
        {
          label: "250-500",
          value: "250_500",
        },
        {
          label: "500-1000",
          value: "500_1000",
        },
        {
          label: "1000-5000",
          value: "1000_5000",
        },
        {
          label: "5000-10000",
          value: "5000_10000",
        },
        {
          label: "10000+",
          value: "10000",
        },
      ],
    },
    companyValue: {
      type: "string",
      label: "Value",
      description: "The value of the company to your organization.",
      optional: true,
      options: [
        {
          label: "High",
          value: "high",
        },
        {
          label: "Medium",
          value: "medium",
        },
        {
          label: "Low",
          value: "low",
        },
      ],
    },
    feedback: {
      type: "string",
      label: "Feedback",
      description: "The feedback text. This field accepts HTML and is stored as UTF-8.",
    },
    tagId: {
      type: "string",
      label: "Tag ID",
      description: "The tag id",
      async options() {
        const tags = await this.listTags();
        return tags.map(({
          id: value, tag: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    personaId: {
      type: "string",
      label: "Persona ID",
      description: "The persona id",
      async options() {
        const personas = await this.listPersonas();
        return personas.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The company id",
      async options({ page }) {
        const { companies } = await this.listCompanies({
          params: {
            page: page + 1,
          },
        });
        return companies.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    jobroleId: {
      type: "string",
      label: "Job Role ID",
      description: "The job role id",
      async options() {
        const jobroles = await this.listJobroles();
        return jobroles.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The product id",
      async options() {
        const products = await this.listProducts();
        return products.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    statusId: {
      type: "string",
      label: "Status ID",
      description: "The workflow status id",
      async options() {
        const statuses = await this.listStatuses();
        return statuses.map(({
          id: value, status: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The contact id",
      async options({ page }) {
        const { contacts } = await this.listContacts({
          params: {
            page: page + 1,
          },
        });
        return contacts.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    feedbackId: {
      type: "string",
      label: "Feedback ID",
      description: "The feedback id",
      async options({ page }) {
        const feedbacks = await this.listFeedbacks({
          params: {
            page: page + 1,
          },
        });
        return feedbacks.map(({
          id: value, feedback: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    ideaId: {
      type: "string",
      label: "Idea ID",
      description: "The idea id",
      async options({ page }) {
        const { ideas } = await this.listIdeas({
          params: {
            page: page + 1,
          },
        });
        return ideas.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    async makeRequest({
      step = this, path, headers, url, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        ...args,
      };

      return axios(step, config);
    },
    create(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    update(args = {}) {
      return this.makeRequest({
        method: "put",
        ...args,
      });
    },
    createCompany(args = {}) {
      return this.create({
        path: "/companies",
        ...args,
      });
    },
    createFeedback(args = {}) {
      return this.create({
        path: "/feedbacks",
        ...args,
      });
    },
    createContact(args = {}) {
      return this.create({
        path: "/contacts",
        ...args,
      });
    },
    listTags(args = {}) {
      return this.makeRequest({
        path: "/tags",
        ...args,
      });
    },
    listPersonas(args = {}) {
      return this.makeRequest({
        path: "/personas",
        ...args,
      });
    },
    listCompanies(args = {}) {
      return this.makeRequest({
        path: "/companies",
        ...args,
      });
    },
    listJobroles(args = {}) {
      return this.makeRequest({
        path: "/jobroles",
        ...args,
      });
    },
    listProducts(args = {}) {
      return this.makeRequest({
        path: "/products",
        ...args,
      });
    },
    listStatuses(args = {}) {
      return this.makeRequest({
        path: "/statuses",
        ...args,
      });
    },
    listContacts(args = {}) {
      return this.makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    listFeedbacks(args = {}) {
      return this.makeRequest({
        path: "/feedbacks",
        ...args,
      });
    },
    listIdeas(args = {}) {
      return this.makeRequest({
        path: "/ideas",
        ...args,
      });
    },
    listFeedbackIdeas({
      feedbackId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/feedbacks/${feedbackId}/ideas`,
        ...args,
      });
    },
    listUserstories(args = {}) {
      return this.makeRequest({
        path: "/userstories",
        ...args,
      });
    },
    async *getResourcesStream({
      requestResourcesFn,
      requestResourcesArgs,
      resourceName,
      lastCreatedAt,
      max = constants.DEFAULT_MAX,
    }) {
      let page = 1;
      let resourcesCount = 0;

      while (true) {
        const response =
          await requestResourcesFn({
            ...requestResourcesArgs,
            params: {
              page,
            },
          });

        const nextResources =
          Array.isArray(response)
            ? response
            : response[resourceName];

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          const dateFilter =
            lastCreatedAt
            && Date.parse(resource.created_at) > Date.parse(lastCreatedAt);

          if (!lastCreatedAt || dateFilter) {
            yield resource;
            resourcesCount += 1;
          }

          if (resourcesCount >= max) {
            return;
          }
        }

        // It doesn't support pagination
        if (Array.isArray(response)) {
          return;
        }

        page += 1;
      }
    },
  },
};
