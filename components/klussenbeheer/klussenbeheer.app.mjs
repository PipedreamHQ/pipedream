import { randomUUID } from "node:crypto";
import { axios } from "@pipedream/platform";

const BASE_URL = "https://samdesk.nl";

const STAGE_OPTIONS = [
  {
    label: "New",
    value: "new_lead",
  },
  {
    label: "Contact to Make",
    value: "contact_to_make",
  },
  {
    label: "Plan a Site Visit",
    value: "site_visit_to_plan",
  },
  {
    label: "Prepare Quote",
    value: "quote_to_prepare",
  },
  {
    label: "Quote Sent",
    value: "quote_sent",
  },
  {
    label: "Awaiting Response",
    value: "awaiting_response",
  },
  {
    label: "Won",
    value: "won",
  },
  {
    label: "Scheduled",
    value: "scheduled",
  },
  {
    label: "Work Completed",
    value: "work_completed",
  },
  {
    label: "Invoice Sent",
    value: "invoice_sent",
  },
  {
    label: "Completed",
    value: "completed",
  },
  {
    label: "Lost",
    value: "lost",
  },
];

export default {
  type: "app",
  app: "klussenbeheer",
  propDefinitions: {
    searchTerm: {
      type: "string",
      label: "Search Term",
      description: "Search in job title, customer name, address or phone number.",
    },
    stage: {
      type: "string",
      label: "Stage",
      description: "Only return jobs in this stage.",
      options: STAGE_OPTIONS,
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Max number of results to return, between 1 and 25.",
      min: 1,
      max: 25,
      default: 25,
    },
    jobId: {
      type: "integer",
      label: "Job ID",
      description: "The ID of the job. Use **Search Jobs** to find it.",
    },
    note: {
      type: "string",
      label: "Note",
      description: "The text of the private note. Nothing is sent to the customer.",
    },
    customerName: {
      type: "string",
      label: "Name",
      description: "Name of the customer. For business customers: the company name.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the customer.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the customer.",
      optional: true,
    },
    customerAddress: {
      type: "string",
      label: "Address",
      description: "Street of the customer.",
      optional: true,
    },
    houseNumber: {
      type: "string",
      label: "House Number",
      description: "House number, e.g. `12a`.",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Postal code of the customer.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the customer.",
      optional: true,
    },
    business: {
      type: "boolean",
      label: "Business",
      description: "Whether the customer is a business (on) or a consumer (off).",
      optional: true,
      default: false,
    },
    kvkNumber: {
      type: "string",
      label: "KvK Number",
      description: "Dutch chamber of commerce (KvK) number, for business customers.",
      optional: true,
    },
    jobType: {
      type: "string",
      label: "Job Type",
      description: "Type of job, e.g. `Roof inspection`.",
      optional: true,
    },
    jobAddress: {
      type: "string",
      label: "Address",
      description: "Address of the job.",
      optional: true,
    },
    jobDescription: {
      type: "string",
      label: "Description",
      description: "Description of the job.",
      optional: true,
    },
    nextAction: {
      type: "string",
      label: "Next Action",
      description: "What should happen next for this job.",
      optional: true,
    },
  },
  methods: {
    /**
     * Call one tool on the Klussenbeheer MCP endpoint (stateless JSON-RPC 2.0)
     * and return the parsed JSON payload of the tool result.
     *
     * @param {object} $ - the Pipedream step context, used for error reporting
     * @param {string} toolName - the name of the tool to call
     * @param {object} toolArguments - the arguments passed to the tool
     * @returns {object} the parsed tool result
     */
    async _callTool($, toolName, toolArguments = {}) {
      const response = await axios($, {
        method: "POST",
        url: `${BASE_URL}/mcp/${this.$auth.token}/`,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        data: {
          jsonrpc: "2.0",
          id: randomUUID(),
          method: "tools/call",
          params: {
            name: toolName,
            arguments: toolArguments,
          },
        },
      });
      if (response.error) {
        throw new Error(response.error.message ?? "The request to Klussenbeheer failed.");
      }
      const result = response.result ?? {};
      const text = (result.content ?? []).find((entry) => entry.type === "text")?.text ?? "{}";
      let payload;
      try {
        payload = JSON.parse(text);
      } catch {
        payload = {
          message: text,
        };
      }
      if (result.isError) {
        throw new Error(String(payload.error ?? payload.message ?? "The operation failed in Klussenbeheer."));
      }
      return payload;
    },
    /**
     * Copy the provided (non-empty) values into the argument names the API
     * expects, so empty props are not sent.
     *
     * @param {object} source - values keyed by prop name
     * @param {object} keyMap - mapping from prop name to API argument name
     * @returns {object} the arguments to send
     */
    _mapProvidedFields(source, keyMap) {
      const result = {};
      for (const [
        localName,
        apiName,
      ] of Object.entries(keyMap)) {
        const value = source[localName];
        if (value !== undefined && value !== null && value !== "") {
          result[apiName] = value;
        }
      }
      return result;
    },
    /**
     * Search customers by name, email address or phone number.
     *
     * @param {object} $ - the Pipedream step context, used for error reporting
     * @param {string} searchTerm - the search term
     * @returns {object[]} the matching customers (up to 10)
     */
    async searchCustomers($, searchTerm) {
      const payload = await this._callTool($, "zoek_klanten", {
        zoekterm: searchTerm,
      });
      return payload.items ?? [];
    },
    /**
     * Create a customer. If a customer with the same phone number or email
     * address already exists, it is reused unchanged.
     *
     * @param {object} $ - the Pipedream step context, used for error reporting
     * @param {object} fields - the customer fields
     * @returns {object} the created (or reused) customer
     */
    async createCustomer($, fields) {
      return this._callTool($, "klant_toevoegen", this._mapProvidedFields(fields, {
        customerName: "naam",
        phone: "telefoon",
        email: "email",
        customerAddress: "adres",
        houseNumber: "huisnummer",
        postalCode: "postcode",
        city: "plaats",
        business: "zakelijk",
        kvkNumber: "kvk_nummer",
      }));
    },
    /**
     * Create a job. Depending on the organization settings, this can send a
     * notification to the account owner or admin.
     *
     * @param {object} $ - the Pipedream step context, used for error reporting
     * @param {object} fields - the job fields
     * @returns {object} the created job
     */
    async createJob($, fields) {
      return this._callTool($, "klus_aanmaken", this._mapProvidedFields(fields, {
        customerName: "naam",
        phone: "telefoon",
        email: "email",
        jobType: "klus_type",
        jobAddress: "adres",
        jobDescription: "omschrijving",
        nextAction: "volgende_actie",
        postalCode: "postcode",
        houseNumber: "huisnummer",
      }));
    },
    /**
     * Search jobs by title, customer name, address or phone number, newest
     * first.
     *
     * @param {object} $ - the Pipedream step context, used for error reporting
     * @param {object} [opts] - the search options
     * @param {string} [opts.searchTerm] - the search term
     * @param {string} [opts.stage] - only return jobs in this stage
     * @param {number} [opts.limit=25] - max number of results (1-25)
     * @returns {object[]} the matching jobs
     */
    async searchJobs($, {
      searchTerm, stage, limit = 25,
    } = {}) {
      const toolArguments = this._mapProvidedFields({
        searchTerm,
        stage,
      }, {
        searchTerm: "zoekterm",
        stage: "fase",
      });
      toolArguments.limiet = limit;
      const payload = await this._callTool($, "zoek_klussen", toolArguments);
      return payload.items ?? [];
    },
    /**
     * Get the full details of one job, including notes, timeline and quotes.
     *
     * @param {object} $ - the Pipedream step context, used for error reporting
     * @param {number} jobId - the job ID
     * @returns {object} the job details
     */
    async getJob($, jobId) {
      return this._callTool($, "klus_detail", {
        klus_id: jobId,
      });
    },
    /**
     * Add a private note to a job. Nothing is sent to the customer.
     *
     * @param {object} $ - the Pipedream step context, used for error reporting
     * @param {number} jobId - the job ID
     * @param {string} note - the note text
     * @returns {object} the tool result
     */
    async addJobNote($, jobId, note) {
      return this._callTool($, "notitie_toevoegen", {
        klus_id: jobId,
        tekst: note,
      });
    },
    /**
     * Get the planning: the jobs planned for today (`vandaag`), tomorrow
     * (`morgen`) and the coming week (`komend`).
     *
     * @param {object} $ - the Pipedream step context, used for error reporting
     * @returns {object} the planning
     */
    async getPlanning($) {
      return this._callTool($, "planning", {});
    },
  },
};
