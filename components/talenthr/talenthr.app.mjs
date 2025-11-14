import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "talenthr",
  propDefinitions: {
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the new employee",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the new employee",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the new employee",
    },
    hireDate: {
      type: "string",
      label: "Hire Date",
      description: "The date of the new employee's hire. **Format YYYY-MM-DD**",
    },
    employmentStatusId: {
      type: "string",
      label: "Employment Status ID",
      description: "The employment status ID",
      async options() {
        const { data } = await this.listEmploymentStatuses();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    employeeId: {
      type: "string",
      label: "Employee ID",
      description: "The ID of the employee",
      async options({ page }) {
        const { data: { rows } } = await this.listEmployees({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return rows.map(({
          id: value, first_name: fName, last_name: lName, email,
        }) => ({
          label: `${fName} ${lName} (${email})`,
          value,
        }));
      },
    },
    timeOffRequestId: {
      type: "string",
      label: "Time Off Request ID",
      description: "The ID of the employee's time off request",
      async options({
        page, employeeId,
      }) {
        const { data: { rows } } = await this.listTimeOffRequests({
          employeeId,
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return rows.map(({
          id: value, timeoff_type_name: tName, start_date: sDate, end_date: eDate,
        }) => ({
          label: `(${tName}) start: ${sDate} / end: ${eDate}`,
          value,
        }));
      },
    },
    jobTitleId: {
      type: "string",
      label: "Job Title ID",
      description: "The ID of the job title.",
      async options() {
        const { data } = await this.listJobTitles();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    jobLocationId: {
      type: "string",
      label: "Job Location ID",
      description: "The ID of the job location.",
      async options() {
        const { data } = await this.listJobLocations();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    divisionId: {
      type: "string",
      label: "Division ID",
      description: "The division for which the application has been submitted",
      async options() {
        const { data } = await this.listDivisions();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    departmentId: {
      type: "string",
      label: "Department ID",
      description: "The department for which the application has been submitted",
      async options() {
        const { data } = await this.listDepartments();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address where the meeting will take place. Required if **Who ID** and **When Time** is present.",
    },
    nationality: {
      type: "string",
      label: "Nationality",
      description: "The nationality of the employee",
      async options() {
        const { data } = await this.listNationalities();
        return data;
      },
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country where the employee lives",
      async options() {
        const { data } = await this.listCountries();
        return data;
      },
    },
    emergencyContactRelationshipTypeId: {
      type: "string",
      label: "Emergency Contact Relationship Type",
      description: "The type of the emergency contact's relationship",
      async options() {
        const { data } = await this.listRelationshipTypes();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    jobPositionId: {
      type: "string",
      label: "Job Position",
      description: "The job position for which the application has been submitted",
      async options() {
        const { data } = await this.listJobPositions();
        return data.map(({
          job_position_title: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    dataFields: {
      type: "object",
      label: "Data Fields",
      description: "The data fields to be updated for the employee",
    },
    requestId: {
      type: "string",
      label: "Request ID",
      description: "The ID of the time off request",
    },
    responseStatus: {
      type: "string",
      label: "Response Status",
      description: "The response status for the time off request",
      options: [
        "approved",
        "pending",
        "declined",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://pubapi.talenthr.io/v1";
    },
    _auth() {
      return  {
        username: `${this.$auth.api_key}`,
        password: "c",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        auth: this._auth(),
        ...opts,
      });
    },
    listEmploymentStatuses(opts = {}) {
      return this._makeRequest({
        path: "/employment-statuses",
        ...opts,
      });
    },
    listJobTitles(opts = {}) {
      return this._makeRequest({
        path: "/job-titles",
        ...opts,
      });
    },
    listJobLocations(opts = {}) {
      return this._makeRequest({
        path: "/locations",
        ...opts,
      });
    },
    listDivisions(opts = {}) {
      return this._makeRequest({
        path: "/divisions",
        ...opts,
      });
    },
    listDepartments(opts = {}) {
      return this._makeRequest({
        path: "/departments",
        ...opts,
      });
    },
    listEmployees(opts = {}) {
      return this._makeRequest({
        path: "/directory",
        ...opts,
      });
    },
    listNationalities(opts = {}) {
      return this._makeRequest({
        path: "/nationalities",
        ...opts,
      });
    },
    listCountries(opts = {}) {
      return this._makeRequest({
        path: "/countries",
        ...opts,
      });
    },
    listRelationshipTypes(opts = {}) {
      return this._makeRequest({
        path: "/relationship-types",
        ...opts,
      });
    },
    listLanguages(opts = {}) {
      return this._makeRequest({
        path: "/languages",
        ...opts,
      });
    },
    listJobPositions(opts = {}) {
      return this._makeRequest({
        path: "/job-positions",
        ...opts,
      });
    },
    listTimeOffRequests({
      employeeId, ...opts
    }) {
      return this._makeRequest({
        path: `/employees/${employeeId}/time-off-requests`,
        ...opts,
      });
    },
    listNewJobApplications(opts = {}) {
      const {
        jobPositionId, ...otherOpts
      } = opts;
      return this._makeRequest({
        path: `${jobPositionId
          ? `/job-positions/${jobPositionId}`
          : ""}/ats-applicants`,
        ...otherOpts,
      });
    },
    createEmployee(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/employees/hire",
        ...opts,
      });
    },
    updateEmployee({
      employeeId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/employees/${employeeId}`,
        ...opts,
      });
    },
    respondToTimeOffRequest({
      timeOffRequestId, employeeId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/employees/${employeeId}/time-off-requests/${timeOffRequestId}/reply`,
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
        params.limit = LIMIT;
        params.offset = LIMIT * page++;
        const { data: { rows } } = await fn({
          params,
          ...opts,
        });
        for (const d of rows) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = rows.length;

      } while (hasMore);
    },
  },
};
