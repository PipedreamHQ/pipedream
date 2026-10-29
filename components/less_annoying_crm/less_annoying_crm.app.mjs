import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "less_annoying_crm",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of a contact or company (a long numeric string, e.g. `4135054762542398391286410820683`). Use **Search Contacts** to find it by name, email, or phone.",
    },
    pipelineId: {
      type: "string",
      label: "Pipeline ID",
      description: "The ID of a pipeline (a long numeric string, e.g. `4135054762542398391286410820684`). Use **List Pipelines** to discover pipeline IDs and their statuses.",
    },
    statusId: {
      type: "string",
      label: "Status ID",
      description: "The ID of a status within the pipeline (a long numeric string, e.g. `4135054762542398391286410820685`). Use **List Pipelines** to discover valid status IDs for each pipeline.",
    },
    assignedTo: {
      type: "string",
      label: "Assigned To (User ID)",
      description: "The ID of the CRM user to assign to (a numeric string, e.g. `1240220`). Use **List Users** to find user IDs.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of results to return per call (e.g. `50`; default 50, max 10000).",
      optional: true,
      min: 1,
      max: 10000,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page of results to return, starting at 1, e.g. `2`. Increment while the response has `hasMoreResults: true`.",
      optional: true,
      min: 1,
    },
    emails: {
      type: "string[]",
      label: "Email Addresses",
      description: "Email addresses, e.g. `[\"jane@acme.com\"]`. All are saved with the label in `Contact Info Label`.",
      optional: true,
    },
    phones: {
      type: "string[]",
      label: "Phone Numbers",
      description: "Phone numbers, e.g. `[\"555-123-4567\"]`. All are saved with the label in `Contact Info Label`.",
      optional: true,
    },
    websites: {
      type: "string[]",
      label: "Websites",
      description: "Website URLs, e.g. `[\"https://acme.com\"]`.",
      optional: true,
    },
    infoType: {
      type: "string",
      label: "Contact Info Label",
      description: "Label applied to the emails, phones, and address (e.g. `Work`, `Home`, `Other`). Must match a type configured in the CRM. Leave blank to use the account's first type.",
      optional: true,
    },
    street: {
      type: "string",
      label: "Street",
      description: "Street address, e.g. `123 Main St`. Street, city, state, zip, and country are saved together as one address.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City for the address, e.g. `Austin`.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State or region for the address, e.g. `TX`.",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "Zip or postal code for the address, e.g. `78701`.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country for the address, e.g. `United States`.",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Job title, e.g. `VP of Sales`. Applies to people only, not companies.",
      optional: true,
    },
    employer: {
      type: "string",
      label: "Employer (Company Name)",
      description: "For a person: the company they work for, e.g. `Acme Inc`. Ignored for companies.",
      optional: true,
    },
    sortDirection: {
      type: "string",
      label: "Sort Direction",
      description: "Sort order, e.g. `Ascending`.",
      options: [
        "Ascending",
        "Descending",
      ],
      optional: true,
    },
    advancedFilters: {
      type: "string",
      label: "Advanced Filters",
      description: "JSON array of filters, e.g. `[{\"Name\": \"DateCreated\", \"Operation\": \"GreaterThan\", \"Value\": \"2025-01-01\"}]`.",
      optional: true,
    },
    pipelineItemNote: {
      type: "string",
      label: "Note",
      description: "Optional note shown in the pipeline item's history, e.g. `Sent proposal, awaiting signature`.",
      optional: true,
    },
    runStatusAutomation: {
      type: "boolean",
      label: "Run Status Automation",
      description: "Run the automation configured on the pipeline item's status, if any, e.g. `true`. Defaults to false.",
      optional: true,
    },
    backgroundInfo: {
      type: "string",
      label: "Background Info",
      description: "Free-text background information shown on the record, e.g. `Met at the 2026 trade show; prefers email over phone.`",
      optional: true,
    },
    birthday: {
      type: "string",
      label: "Birthday",
      description: "Birthday as `YYYY-MM-DD`, e.g. `1985-03-21`, or `0000-MM-DD` (e.g. `0000-03-21`) if the year is unknown. People only.",
      optional: true,
    },
    customFields: {
      type: "string",
      label: "Custom Fields",
      description: "JSON object of account-specific custom field values keyed by field name, e.g. `{\"Lead Source\": \"Referral\"}`. Merged into the request as-is.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.lessannoyingcrm.com/v2/";
    },
    // Every Less Annoying CRM v2 call is a POST to a single endpoint with the
    // function name and its parameters in the JSON body.
    _makeRequest({
      $ = this, fn, parameters = {}, ...opts
    }) {
      return axios($, {
        method: "POST",
        url: this._baseUrl(),
        headers: {
          "Authorization": this.$auth.api_key,
          "Content-Type": "application/json",
        },
        data: {
          Function: fn,
          Parameters: parameters,
        },
        ...opts,
      });
    },
    getUser(opts = {}) {
      return this._makeRequest({
        fn: "GetUser",
        ...opts,
      });
    },
    getUsers(opts = {}) {
      return this._makeRequest({
        fn: "GetUsers",
        ...opts,
      });
    },
    getPipelines(opts = {}) {
      return this._makeRequest({
        fn: "GetPipelines",
        ...opts,
      });
    },
    getContact(opts = {}) {
      return this._makeRequest({
        fn: "GetContact",
        ...opts,
      });
    },
    getContacts(opts = {}) {
      return this._makeRequest({
        fn: "GetContacts",
        ...opts,
      });
    },
    getContactsById(opts = {}) {
      return this._makeRequest({
        fn: "GetContactsById",
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        fn: "CreateContact",
        ...opts,
      });
    },
    editContact(opts = {}) {
      return this._makeRequest({
        fn: "EditContact",
        ...opts,
      });
    },
    getNotesAttachedToContact(opts = {}) {
      return this._makeRequest({
        fn: "GetNotesAttachedToContact",
        ...opts,
      });
    },
    getTasksAttachedToContact(opts = {}) {
      return this._makeRequest({
        fn: "GetTasksAttachedToContact",
        ...opts,
      });
    },
    getEventsAttachedToContact(opts = {}) {
      return this._makeRequest({
        fn: "GetEventsAttachedToContact",
        ...opts,
      });
    },
    getPipelineItemsAttachedToContact(opts = {}) {
      return this._makeRequest({
        fn: "GetPipelineItemsAttachedToContact",
        ...opts,
      });
    },
    getPipelineItem(opts = {}) {
      return this._makeRequest({
        fn: "GetPipelineItem",
        ...opts,
      });
    },
    getPipelineItems(opts = {}) {
      return this._makeRequest({
        fn: "GetPipelineItems",
        ...opts,
      });
    },
    createPipelineItem(opts = {}) {
      return this._makeRequest({
        fn: "CreatePipelineItem",
        ...opts,
      });
    },
    editPipelineItem(opts = {}) {
      return this._makeRequest({
        fn: "EditPipelineItem",
        ...opts,
      });
    },
    createNote(opts = {}) {
      return this._makeRequest({
        fn: "CreateNote",
        ...opts,
      });
    },
    createTask(opts = {}) {
      return this._makeRequest({
        fn: "CreateTask",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        fn: "CreateWebhook",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        fn: "DeleteWebhook",
        ...opts,
      });
    },
  },
};
