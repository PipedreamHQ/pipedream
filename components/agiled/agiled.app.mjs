import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "agiled",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "The full name of the person.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the person.",
    },
    designation: {
      type: "string",
      label: "Designation",
      description: "The designation or title of the employee.",
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the person.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the person.",
      optional: true,
    },
    department: {
      type: "string",
      label: "Department",
      description: "The department the employee is part of.",
      optional: true,
    },
    projectTitle: {
      type: "string",
      label: "Project Title",
      description: "The title of the project.",
    },
    projectDescription: {
      type: "string",
      label: "Project Description",
      description: "A brief description of the project.",
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date for the project or invoice.",
      optional: true,
    },
    client: {
      type: "string",
      label: "Client",
      description: "The client associated with the project or invoice.",
    },
    assignedEmployees: {
      type: "string[]",
      label: "Assigned Employees",
      description: "The employees assigned to the project.",
      optional: true,
    },
    invoiceNumber: {
      type: "string",
      label: "Invoice Number",
      description: "The unique identifier for the invoice.",
    },
    amount: {
      type: "number",
      label: "Amount",
      description: "The total amount of the invoice.",
    },
    items: {
      type: "string[]",
      label: "Items",
      description: "The items to include in the invoice.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Any additional notes for the invoice.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://my.agiled.app/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    async createEmployee(opts = {}) {
      const requestBody = {
        name: opts.name,
        email: opts.email,
        designation: opts.designation,
        address: opts.address,
        phone_number: opts.phoneNumber,
        department: opts.department,
      };
      return this._makeRequest({
        method: "POST",
        path: "/employees",
        data: requestBody,
      });
    },
    async createProject(opts = {}) {
      const requestBody = {
        project_title: opts.projectTitle,
        project_description: opts.projectDescription,
        due_date: opts.dueDate,
        client: opts.client,
        assigned_employees: opts.assignedEmployees
          ? opts.assignedEmployees.map(JSON.parse)
          : [],
      };
      return this._makeRequest({
        method: "POST",
        path: "/projects",
        data: requestBody,
      });
    },
    async createInvoice(opts = {}) {
      const requestBody = {
        client: opts.client,
        invoice_number: opts.invoiceNumber,
        total: opts.amount,
        due_date: opts.dueDate,
        items: opts.items
          ? opts.items.map(JSON.parse)
          : [],
        notes: opts.notes,
      };
      return this._makeRequest({
        method: "POST",
        path: "/invoices",
        data: requestBody,
      });
    },
  },
};
