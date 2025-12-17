import { GraphQLClient } from "graphql-request";
import {
  GENDER_OPTIONS, LIMIT,
} from "./common/constants.mjs";
import mutations from "./common/mutations.mjs";
import queries from "./common/queries.mjs";

export default {
  type: "app",
  app: "kiwihr",
  propDefinitions: {
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the employee",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the employee",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the employee",
    },
    workPhones: {
      type: "string[]",
      label: "Work Phones",
      description: "A list of employee's work phone numbers",
    },
    employmentStartDate: {
      type: "string",
      label: "Employment Start Date",
      description: "User's work started date. **Format YYYY-MM-DD**",
    },
    aboutMe: {
      type: "string",
      label: "About Me",
      description: "Short info about the user",
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "The gender of the employee",
      options: GENDER_OPTIONS,
    },
    managerId: {
      type: "string",
      label: "Manager ID",
      description: "ID of the user's manager",
      async options({ page }) {
        const { availableManagers: { items } } = await this.listManagers({
          sort: [
            {
              "field": "firstName",
              "direction": "asc",
            },
          ],
          limit: LIMIT,
          offset: LIMIT * page,
        });

        return items.map(({
          id: value, firstName, lastName, email,
        }) => ({
          label: `${firstName} ${lastName} (${email})`,
          value,
        }));
      },
    },
    nationality: {
      type: "string",
      label: "Nationality",
      description: "2-digit Employee's nationality in [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)",
    },
    teamIds: {
      type: "string[]",
      label: "Team IDs",
      description: "List of IDs of teams user belongs to",
      async options({ page }) {
        const { teams: { items } } = await this.listTeams({
          limit: LIMIT,
          offset: LIMIT * page,
        });

        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    positionId: {
      type: "string",
      label: "Position ID",
      description: "Employee's position ID",
      async options({ page }) {
        const { positions: { items } } = await this.listPositions({
          limit: LIMIT,
          offset: LIMIT * page,
        });

        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    locationId: {
      type: "string",
      label: "Location ID",
      description: "Employee's location ID",
      async options({ page }) {
        const { locations: { items } } = await this.listLocations({
          limit: LIMIT,
          offset: LIMIT * page,
        });

        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    birthDate: {
      type: "string",
      label: "Birth Date",
      description: "Employee's date of birth",
    },
    personalPhone: {
      type: "string",
      label: "Personal Phone",
      description: "Employee's personal phone number",
    },
    personalEmail: {
      type: "string",
      label: "Personal Email",
      description: "Employee's personal email address",
    },
    addressStreet: {
      type: "string",
      label: "Street",
      description: "The employee's street address",
    },
    addressCity: {
      type: "string",
      label: "City",
      description: "The employee's city address",
    },
    addressState: {
      type: "string",
      label: "State",
      description: "The employee's state address",
    },
    addressPostalCode: {
      type: "string",
      label: "Postal Code",
      description: "The employee's postal code address",
    },
    addressCountry: {
      type: "string",
      label: "Country",
      description: "The employee's country address",
    },
    pronouns: {
      type: "string",
      label: "pronouns",
      description: "The employee's pronouns",
    },
    employeeId: {
      type: "string",
      label: "Employee ID",
      description: "ID of the employee you want to update",
      async options({ page }) {
        const { users: { items } } = await this.listUsers({
          limit: LIMIT,
          offset: LIMIT * page,
        });

        return items.map(({
          id: value, firstName, lastName, email,
        }) => ({
          label: `${firstName} ${lastName} (${email})`,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.subdomain}.kiwihr.com/api/graphql`;
    },
    _headers() {
      return {
        "x-api-key": `${this.$auth.api_key}`,
      };
    },
    getClient() {
      const url = this._baseUrl();
      const options = {
        headers: this._headers(),
      };
      return new GraphQLClient(url, options);
    },
    _makeRequest({
      query, variables,
    } = {}) {
      return this.getClient().request(query, variables);
    },
    createEmployee(variables) {
      return this._makeRequest({
        query: mutations.createEmployee,
        variables,
      });
    },
    updateEmployee(variables) {
      return this._makeRequest({
        query: mutations.updateEmployee,
        variables,
      });
    },
    listUsers(variables) {
      return this._makeRequest({
        query: queries.listUsers,
        variables,
      });
    },
    listManagers(variables) {
      return this._makeRequest({
        query: queries.listManagers,
        variables,
      });
    },
    listTeams(variables) {
      return this._makeRequest({
        query: queries.listTeams,
        variables,
      });
    },
    listPositions(variables) {
      return this._makeRequest({
        query: queries.listPositions,
        variables,
      });
    },
    listLocations(variables) {
      return this._makeRequest({
        query: queries.listLocations,
        variables,
      });
    },
    async *paginate({
      fn, variables = {}, fieldName, maxResults = null,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        variables.limit = LIMIT;
        variables.offset = LIMIT * page++;
        const data = await fn(variables);
        for (const d of data[fieldName].items) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data[fieldName].items.length;

      } while (hasMore);
    },
  },
};
