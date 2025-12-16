import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/util.mjs";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-xero-accounting-create-employee",
  name: "Create Employee",
  description: "Creates a new employee.",
  version: "0.3.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    xeroAccountingApi,
    tenantId: {
      propDefinition: [
        xeroAccountingApi,
        "tenantId",
      ],
    },
    firstName: {
      label: "First Name",
      type: "string",
      description: "First name of an employee (max length = 255). If an existing employee matches your `FirstName` and `LastName` then you will receive an error.",
    },
    lastName: {
      label: "Last Name",
      type: "string",
      description: "Last name of an employee (max length = 255). If an existing employee matches your `FirstName` and `LastName` then you will receive an error.",
    },
    status: {
      label: "Status",
      type: "string",
      description: "Current status of an employee - see contact status [types](https://developer.xero.com/documentation/api/types#ContactStatuses)",
      optional: true,
      options: [
        "ACTIVE",
        "ARCHIVED",
        "GDPRREQUEST",
      ],
    },
    externalLink: {
      label: "External Link",
      type: "object",
      description: "Link to an external resource, for example, an employee record in an external system. You can specify the URL element.\nThe description of the link is auto-generated in the form \"Go to <App name>\". <App name> refers to the [Xero application](https://api.xero.com/Application) name that is making the API call.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.tenantId || !this.firstName || !this.lastName) {
      throw new ConfigurationError("Must provide **Tenant ID**, **First Name**, and **Last Name** parameters.");
    }

    const response = await this.xeroAccountingApi.createEmployee({
      $,
      tenantId: this.tenantId,
      data: {
        Status: this.status,
        FirstName: this.firstName,
        LastName: this.lastName,
        ExternalLink: parseObject(this.externalLink),
      },
    });

    $.export("$summary", `Successfully created employee with ID: ${response.EmployeeID}`);
    return response;
  },
};
