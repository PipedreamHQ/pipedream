import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rejoiner",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List ID",
      description: "Unique identifier for the list",
      async options() {
        const lists = await this.listLists();
        return lists?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the customer",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the customer",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the customer",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "A phone number for the customer",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "Timezone of customer, should be in list of [TZ database names](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Two letter [code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) of customers language",
      optional: true,
    },
    address1: {
      type: "string",
      label: "Address Line 1",
      description: "First line of address for customer",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Address Line 2",
      description: "Second line of address for customer",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City where customer lives",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State where customer lives",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Postal code of customer's address",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country where customer lives",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://rj2.rejoiner.com/api/v2/${this.$auth.site_id}`;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Rejoiner ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
        ...otherOpts,
      });
    },
    listLists(opts = {}) {
      return this._makeRequest({
        path: "/lists",
        ...opts,
      });
    },
    listListContacts({
      listId, ...opts
    }) {
      return this._makeRequest({
        path: `/lists/${listId}/contacts/`,
        ...opts,
      });
    },
    addCustomerToList({
      listId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/lists/${listId}/contacts/`,
        ...opts,
      });
    },
    updateCustomerProfile(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/customers/by_email/",
        ...opts,
      });
    },
    async *paginate({
      fn,
      args,
      max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          page: 1,
        },
      };
      let total, itemCount = 0;

      do {
        const {
          results, count,
        } = await fn(args);
        for (const item of results) {
          yield item;
          itemCount++;
          if (max && itemCount >= max) {
            return;
          }
        }
        total = count;
        args.params.page++;
      } while (itemCount < total);
    },
  },
};
