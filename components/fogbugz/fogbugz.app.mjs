import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fogbugz",
  propDefinitions: {
    filterId: {
      type: "string",
      label: "Filter ID",
      description: "The ID of the filter to monitor for new cases.",
      async options() {
        const { data: { filters } } = await this.listFilters({
          cmd: "listFilter",
        });

        return filters.filter((item) => item.sFilter && item["#cdata-section"]).map((filter) => ({
          label: filter["#cdata-section"],
          value: filter.sFilter,
        }));
      },
    },
    ixAreaId: {
      type: "string",
      label: "Ix Area Id",
      description: "The Id of the Area related with the case.",
      async options({ ixProject }) {
        const { data: { areas } } = await this.post({
          data: {
            cmd: "listAreas",
            fWrite: 1,
            ixProject,
          },
        });

        return areas.map(({
          ixArea: value, sArea: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    ixBugParentId: {
      type: "string",
      label: "Ix Bug Parent Id",
      description: "Make this case a subcase of another case.",
      async options() {
        const { data: { cases } } = await this.post({
          data: {
            cmd: "listCases",
            cols: [
              "sTitle",
            ],
          },
        });

        return cases.map(({
          ixBug: value, sTitle,
        }) => ({
          label: `${sTitle} - ID: ${value}`,
          value,
        }));
      },
    },
    ixCategoryId: {
      type: "string",
      label: "Ix Category Id",
      description: "The Id of the Category related with the case.",
      async options() {
        const { data: { categories } } = await this.post({
          data: {
            cmd: "listCategories",
          },
        });

        return categories.map(({
          ixCategory: value, sCategory: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    ixPersonId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user (ixPerson) to edit.",
      async options() {
        const { data: { people } } = await this.post({
          data: {
            cmd: "listPeople",
            fWrite: 1,
          },
        });

        return people.map(({
          ixPerson: value, sFullName, sEmail,
        }) => ({
          label: `${sFullName} - ${sEmail}`,
          value,
        }));
      },
    },
    ixPriorityId: {
      type: "string",
      label: "Ix Priority Id",
      description: "The Id of the Priority related with the case.",
      async options() {
        const { data: { priorities } } = await this.post({
          data: {
            cmd: "listPriorities",
          },
        });

        return priorities.map(({
          ixPriority: value, sPriority: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    ixProjectId: {
      type: "string",
      label: "Ix Project Id",
      description: "The Id of the Project related with the case.",
      async options() {
        const { data: { projects } } = await this.post({
          data: {
            cmd: "listProjects",
            fWrite: 1,
          },
        });

        return projects.map(({
          ixProject: value, sProject: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    sTags: {
      type: "string[]",
      label: "sTags",
      description: "A list of tags associated with the case.",
      async options() {
        const { data: { tags } } = await this.post({
          data: {
            cmd: "listTags",
          },
        });

        return tags.map(({
          ixTag: value, sTag: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    sTitle: {
      type: "string",
      label: "Case Title",
      description: "The title of the case to create.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.your_site}.fogbugz.com/f/api/0/jsonapi`;
    },
    _data(data) {
      return {
        ...data,
        "token": `${this.$auth.api_token}`,
      };
    },
    _makeRequest({
      $ = this, data, ...opts
    }) {
      const config = {
        url: this._baseUrl(),
        data: this._data(data),
        ...opts,
      };

      return axios($, config);
    },
    post(opts = {}) {
      return this._makeRequest({
        method: "POST",
        ...opts,
      });
    },
  },
};
