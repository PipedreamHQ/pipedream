import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hr_cloud",
  propDefinitions: {
    departmentId: {
      type: "string",
      label: "Department",
      description: "The ID of an employee department",
      async options({ page }) {
        const departments = await this.getDepartments({
          params: {
            page: page + 1,
          },
        });
        return departments.map((department) => ({
          label: department.xDepartmentName,
          value: department.Id,
        }));
      },
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "The ID of a job title",
      async options({ page }) {
        const jobTitles = await this.getJobTitles({
          params: {
            page: page + 1,
          },
        });
        return jobTitles.map((jobTitle) => ({
          label: jobTitle.xPositionTitle,
          value: jobTitle.Id,
        }));
      },
    },
    employeeId: {
      type: "string",
      label: "Employee",
      description: "The ID of an employee",
      async options({ page }) {
        const employees = await this.getEmployees({
          params: {
            page: page + 1,
          },
        });
        return employees.map((employee) => ({
          label: `${employee.xFirstName} ${employee.xLastName}`,
          value: employee.Id,
        }));
      },
    },
    locationId: {
      type: "string",
      label: "Location ID",
      description: "The ID of a location",
      async options({ page }) {
        const locations = await this.getLocations({
          params: {
            page: page + 1,
          },
        });
        return locations.map((location) => ({
          label: location.xLocationName,
          value: location.Id,
        }));
      },
    },
    employmentStatusId: {
      type: "string",
      label: "Employment Status ID",
      description: "The ID of an employment status",
      async options({ page }) {
        const statuses = await this.getEmploymentStatus({
          params: {
            page: page + 1,
          },
        });
        return statuses.map((status) => ({
          label: status.xType,
          value: status.Id,
        }));
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The employee's first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The employee's last name",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The employee's email address",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The employee's start date (YYYY-MM-DD)",
    },
    employeeNumber: {
      type: "string",
      label: "Employee Number",
      description: "Unique employee number",
      optional: true,
    },
    recordStatus: {
      type: "string",
      label: "Record Status",
      description: "The employee status",
      options: [
        "Active",
        "Inactive",
      ],
      default: "Active",
      optional: true,
    },
    address: {
      type: "string",
      label: "Street Address",
      description: "The street address of the employee",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the employee",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the employee",
      optional: true,
    },
    zip: {
      type: "integer",
      label: "Zip",
      description: "The zip code of the employee",
      optional: true,
    },
    applicationCode: {
      type: "string",
      label: "Application Code",
      description: "Alpha-numeric code for application",
      options: [
        "coreHr",
        "onboard",
        "benefits",
        "offboard",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of a task",
    },
    assigneeType: {
      type: "string",
      label: "Assignee Type",
      description: "Type of assignee",
      options: [
        "Employee",
        "Manager",
        "ManagersManager",
        "HrAdmin",
        "HrUser",
        "HrOperation",
        "ItUser",
        "ItOperation",
        "SpecificEmployee",
        "Hierarchy",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://corehr-api.hrcloud.com/v1/cloud";
    },
    _authHeaders() {
      return {
        "customer_key": `${this.$auth.consumer_key}`,
        "customer_secret": `${this.$auth.consumer_secret}`,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $ = this,
      path,
      method = "GET",
      params = {},
      data = {},
    }) {
      const config = {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: this._authHeaders(),
        params,
        data,
      };

      try {
        const response = await axios($, config);
        return response;
      } catch (error) {
        console.error(`Error with request to ${path}: ${error.message}`);
        if (error.response?.status === 404) {
          throw new Error(`API endpoint not found (404): ${path}. Please verify the API URL structure in the HR Cloud documentation.`);
        }
        throw error;
      }
    },
    getDepartments(args = {}) {
      return this._makeRequest({
        path: "/xDepartment",
        ...args,
      });
    },
    getJobTitles(args = {}) {
      return this._makeRequest({
        path: "/xPosition",
        ...args,
      });
    },
    getLocations(args = {}) {
      return this._makeRequest({
        path: "/xLocation",
        ...args,
      });
    },
    getEmploymentStatus(args = {}) {
      return this._makeRequest({
        path: "/xEmploymentStatus",
        ...args,
      });
    },
    getEmployees(args = {}) {
      return this._makeRequest({
        path: "/xEmployee",
        ...args,
      });
    },
    getApplicants(args = {}) {
      return this._makeRequest({
        path: "/xApplicant",
        ...args,
      });
    },
    getTasks(args = {}) {
      return this._makeRequest({
        path: "/xTask",
        ...args,
      });
    },
    createEmployee(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/xEmployee",
        ...args,
      });
    },
    createTask(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/xTask/Portal",
        ...args,
      });
    },
    updateEmployee(args = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/xEmployee",
        ...args,
      });
    },
    async *paginate({
      resourceFn,
      params = {},
      max,
    }) {
      params = {
        ...params,
        page: 1,
      };
      let total, count = 0;
      do {
        const items = await resourceFn({
          params,
        });
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        total = items?.length;
        params.page++;
      } while (total > 0);
    },
  },
};
