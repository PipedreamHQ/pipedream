import jobber from "../../jobber.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "jobber-create-client",
  name: "Create Client",
  description: "Generates a new client within Jobber. [See the documentation](https://developer.getjobber.com/docs)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    jobber,
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the client",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the client",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the client",
    },
    isCompany: {
      type: "boolean",
      label: "Is Company?",
      description: "Set to `true` to specify that the client is a company",
      default: false,
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Company name of the client",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.isCompany && !this.companyName) {
      throw new ConfigurationError("Company Name must be provided.");
    }
    if (!this.isCompany && !this.lastName) {
      throw new ConfigurationError("Last name must be provided");
    }

    const {
      firstName = "",
      lastName = "",
      isCompany,
      companyName = "",
      email,
    } = this;

    const emails = `[{description: MAIN, primary: true, address: "${email}"}]`;

    const response = await this.jobber.post({
      $,
      data: {
        query: `mutation CreateClient {
          clientCreate(
            input: {firstName: "${firstName}", lastName: "${lastName}", isCompany: ${isCompany},
            companyName: "${companyName}", emails: ${emails}}
          ) {
            client {
              id
              firstName
              lastName
              companyName
            }
          }
        }`,
        operationName: "CreateClient",
      },
    });
    if (response.errors) {
      throw new Error(response.errors[0].message);
    }
    $.export("$summary", `Successfully created client with ID ${response.data.clientCreate.client.id}`);
    return response;
  },
};
