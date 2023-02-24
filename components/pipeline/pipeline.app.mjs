import { axios } from "@pipedream/platform";
import querystring from "query-string";

export default {
  type: "app",
  app: "pipeline",
  propDefinitions: {
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The identifier of a company",
      optional: true,
      async options({ page }) {
        return this.getPropOptions(this.listCompanies, page, "name", "id");
      },
    },
    dealId: {
      type: "string",
      label: "Deal ID",
      description: "The identifier of a deal",
      optional: true,
      async options({ page }) {
        return this.getPropOptions(this.listDeals, page, "name", "id");
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The identifier of a user",
      optional: true,
      async options({ page }) {
        return this.getPropOptions(this.listUsers, page, "full_name", "id");
      },
    },
    personId: {
      type: "string",
      label: "Person ID",
      description: "The identifier of a person",
      optional: true,
      async options({ page }) {
        return this.getPropOptions(this.listPeople, page, "full_name", "id");
      },
    },
    dealStageId: {
      type: "string",
      label: "Deal Stage ID",
      description: "The identifier of a deal stage",
      optional: true,
      async options({ page }) {
        return this.getPropOptions(this.listDealStages, page, "name", "id");
      },
    },
    noteCategoryId: {
      type: "string",
      label: "Note Category ID",
      description: "The identifier of a note category",
      optional: true,
      async options({ page }) {
        return this.getPropOptions(this.listNoteCategories, page, "name", "id");
      },
    },
    eventCategoryId: {
      type: "string",
      label: "Event Category ID",
      description: "The identifier of an event category",
      async options({ page }) {
        return this.getPropOptions(this.listEventCategories, page, "name", "id");
      },
    },
    dealStatusId: {
      type: "string",
      label: "Deal Status ID",
      description: "The identifier of a deal status",
      async options({ page }) {
        return this.getPropOptions(this.listDealStatuses, page, "name", "id");
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The person's first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The person's last name",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A more detailed description of the event",
      optional: true,
    },
    allDay: {
      type: "boolean",
      label: "All Day",
      description: "Specify if this event is all day",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "The company's website",
      optional: true,
    },
    address1: {
      type: "string",
      label: "Address1",
      description: "First line of business address",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Address2",
      description: "Second line of business address",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "Business address city",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "Business address state",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Business address postal code",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Business address country",
      optional: true,
    },
    summary: {
      type: "string",
      label: "Summary",
      description: "Explanatory or descriptive text about the deal",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.pipelinecrm.com/api/v3";
    },
    _baseParams() {
      return {
        api_key: this.$auth.api_key,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      params = {},
      ...args
    }) {
      params = {
        ...this._baseParams(),
        ...params,
      };
      const q = querystring.stringify(params);
      const config = {
        url: `${this._baseUrl()}${path}?${q}`,
        ...args,
      };
      return axios($, config);
    },
    async getPropOptions(resourceFn, page, labelKey, valueKey) {
      const { entries } = await resourceFn({
        params: {
          page: page + 1,
        },
      });
      return entries?.map((entry) => ({
        label: entry[labelKey],
        value: entry[valueKey],
      })) || [];
    },
    async paginate(resourceFn, args = {}, page = 1) {
      const results = [];
      while (true) {
        const params = {
          ...args.params,
          page,
        };
        const {
          entries, pagination,
        } = await resourceFn({
          ...args,
          params,
        });
        results.push(...entries);
        page++;
        if (page > pagination.pages) {
          break;
        }
      }
      return {
        results,
        page: page - 1,
      };
    },
    listCompanies(args = {}) {
      return this._makeRequest({
        path: "/companies",
        ...args,
      });
    },
    listDeals(args = {}) {
      return this._makeRequest({
        path: "/deals",
        ...args,
      });
    },
    listPeople(args = {}) {
      return this._makeRequest({
        path: "/people",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/admin/users",
        ...args,
      });
    },
    listDealStages(args = {}) {
      return this._makeRequest({
        path: "/admin/deal_stages",
        ...args,
      });
    },
    listNoteCategories(args = {}) {
      return this._makeRequest({
        path: "/admin/note_categories",
        ...args,
      });
    },
    listEventCategories(args = {}) {
      return this._makeRequest({
        path: "/admin/event_categories",
        ...args,
      });
    },
    listDealStatuses(args = {}) {
      return this._makeRequest({
        path: "/admin/deal_statuses",
        ...args,
      });
    },
    createActivity(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/notes",
        ...args,
      });
    },
    createCalendarEntry(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/calendar_entries",
        ...args,
      });
    },
    createCompany(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/companies",
        ...args,
      });
    },
    createDeal(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/deals",
        ...args,
      });
    },
    createPerson(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/people",
        ...args,
      });
    },
    updatePerson(personId, args = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/people/${personId}`,
        ...args,
      });
    },
    updateCompany(companyId, args = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/companies/${companyId}`,
        ...args,
      });
    },
    updateDeal(dealId, args = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/deals/${dealId}`,
        ...args,
      });
    },
  },
};
