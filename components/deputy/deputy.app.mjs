import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "deputy",
  propDefinitions: {
    accessRights: {
      type: "string",
      label: "Access Rights",
      description: "Access rights to have workplace visibility",
    },
    user: {
      type: "string",
      label: "User",
      description: "The user for whom the timesheet has been saved",
      optional: true,
    },
    locationDetails: {
      type: "object",
      label: "Location Details",
      description: "Location details including name, address, geo-coordinates if available, and timezone",
    },
    photo: {
      type: "string",
      label: "Photo",
      description: "Optional photo for the location",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Optional notes for the location",
      optional: true,
    },
    relatedBusinessUnits: {
      type: "string",
      label: "Related Business Units",
      description: "Optional related business units for the location",
      optional: true,
    },
    employeeIdentifier: {
      type: "string",
      label: "Employee Identifier",
      description: "Identifier for the employee",
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "Start time for the work shift",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "End time for the work shift",
    },
    breakDetails: {
      type: "string",
      label: "Break Details",
      description: "Optional break details for the work shift",
      optional: true,
    },
    personalDetails: {
      type: "object",
      label: "Personal Details",
      description: "Employee’s personal details",
    },
    designation: {
      type: "string",
      label: "Designation",
      description: "Employee's designation",
    },
    employmentType: {
      type: "string",
      label: "Employment Type",
      description: "Employee's employment type",
    },
    contactDetails: {
      type: "string",
      label: "Contact Details",
      description: "Optional contact details for the employee",
      optional: true,
    },
    emergencyContacts: {
      type: "string",
      label: "Emergency Contacts",
      description: "Optional emergency contacts for the employee",
      optional: true,
    },
    employeeNotes: {
      type: "string",
      label: "Notes",
      description: "Optional notes for the employee",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.deputy.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async addNewIndividual(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/addnewworkplace",
        ...opts,
      });
    },
    async addNewNewsfeedPost(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/postajournal",
        ...opts,
      });
    },
    async saveNewTimesheet(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/startanemployeestimesheetclockon",
        ...opts,
      });
    },
    async createNewLocation(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/addalocation",
        ...opts,
      });
    },
    async startNewWorkShift(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/startanemployeestimesheetclockon",
        ...opts,
      });
    },
    async addNewEmployee(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/addanemployee",
        ...opts,
      });
    },
  },
};
