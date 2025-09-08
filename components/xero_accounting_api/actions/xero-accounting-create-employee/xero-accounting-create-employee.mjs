// legacy_hash_id: a_q1i3W6
import { axios } from "@pipedream/platform";

export default {
  key: "xero_accounting_api-xero-accounting-create-employee",
  name: "Create Employee",
  description: "Creates a new employee.",
  version: "0.3.1",
  type: "action",
  props: {
    xero_accounting_api: {
      type: "app",
      app: "xero_accounting_api",
    },
    tenant_id: {
      type: "string",
      description: "Id of the organization tenant to use on the Xero Accounting API. See [Get Tenant Connections](https://pipedream.com/@sergio/xero-accounting-api-get-tenant-connections-p_OKCzOgn/edit) for a workflow example on how to pull this data.",
    },
    first_name: {
      type: "string",
      description: "First name of an employee (max length = 255). If an existing employee matches your `FirstName` and `LastName` then you will receive an error.",
    },
    last_name: {
      type: "string",
      description: "Last name of an employee (max length = 255). If an existing employee matches your `FirstName` and `LastName` then you will receive an error.",
    },
    status: {
      type: "string",
      description: "Current status of an employee - see contact status [types](https://developer.xero.com/documentation/api/types#ContactStatuses)",
      optional: true,
      options: [
        "ACTIVE",
        "ARCHIVED",
        "GDPRREQUEST",
      ],
    },
    external_link: {
      type: "object",
      description: "Link to an external resource, for example, an employee record in an external system. You can specify the URL element.\nThe description of the link is auto-generated in the form \"Go to <App name>\". <App name> refers to the [Xero application](https://api.xero.com/Application) name that is making the API call.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.xero.com/documentation/api/employees
  //on section PUT Employees

    if (!this.tenant_id || !this.first_name || !this.last_name) {
      throw new Error("Must provide tenant_id, first_name, and last_name parameters.");
    }

    return await axios($, {
      method: "put",
      url: "https://api.xero.com/api.xro/2.0/Employees",
      headers: {
        "Authorization": `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
        "xero-tenant-id": this.tenant_id,
      },
      data: {
        Status: this.status,
        FirstName: this.first_name,
        LastName: this.last_name,
        ExternalLink: this.external_link,
      },
    });
  },
};
