import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "ortto",
  propDefinitions: {
    userEmail: {
      type: "string",
      label: "User Email",
      description: "Specify the user email to opt out from all SMS communications.",
      async options({ page }) {
        const { contacts } = await this.listPeople({
          data: {
            limit: LIMIT,
            offset: LIMIT * page,
            fields: [
              "str::first",
              "str::last",
              "str::email",
            ],
          },
        });

        return contacts.map(({ fields }) => ({
          label: `${fields["str::first"]} ${fields["str::last"]} (${fields["str::email"]})`,
          value: fields["str::email"],
        }));
      },
    },
    activityId: {
      type: "string",
      label: "Activity Id",
      description: "The Id of the activity definition. To find Activity ID, login into your Ortto app > CDP > Activities > Select an activity, then you can find the Activity ID in the browser URL as `https://ortto.app/{Org}/activities/{Activity_ID}/overview`. For example, if your Activity URL is `https://ortto.app/pipedreamtest/activities/act::s/overview`, then your Activity ID is `act::s`",
    },
    fields: {
      type: "object",
      label: "Fields",
      description: "The object containing the fields for a person associated with the event.",
    },
    attributes: {
      type: "object",
      label: "Attributes",
      description: "An object with the attributes. To find Activity attributes, login into your Ortto app > CDP > Activities > Select an activity > Developer.",
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.region}/v1`;
    },
    _headers() {
      return {
        "X-Api-Key": `${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        method: "POST",
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listPeople(opts = {}) {
      return this._makeRequest({
        path: "/person/get",
        ...opts,
      });
    },
    updatePerson(opts = {}) {
      return this._makeRequest({
        path: "/person/merge",
        ...opts,
      });
    },
    createPerson(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/person/merge",
        ...opts,
      });
    },
    createCustomActivity(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/activities/create",
        ...opts,
      });
    },
    async *paginate({
      fn, data = {}, fieldName, ...opts
    }) {
      let hasMore = false;
      let page = 0;

      do {
        data.limit = LIMIT;
        data.offset = LIMIT * page++;
        const response = await fn({
          data,
          ...opts,
        });
        for (const d of response[fieldName]) {
          yield d;
        }

        hasMore = response.has_more;

      } while (hasMore);
    },
  },
};
