import { ConfigurationError } from "@pipedream/platform";
import okta from "../../okta.app.mjs";

export default {
  key: "okta-create-user",
  name: "Create User",
  description: "Creates a new user in the Okta system. [See the documentation](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/createUser)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    okta,
    activate: {
      type: "boolean",
      label: "Activate",
      description: "Executes activation lifecycle operation when creating the user. Defaults to true.",
      optional: true,
    },
    firstName: {
      propDefinition: [
        okta,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        okta,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        okta,
        "email",
      ],
    },
    login: {
      propDefinition: [
        okta,
        "login",
      ],
    },
    mobilePhone: {
      propDefinition: [
        okta,
        "mobilePhone",
      ],
      optional: true,
    },
    typeId: {
      propDefinition: [
        okta,
        "typeId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const {
        okta,
        activate,
        typeId,
        ...profile
      } = this;

      const data = {
        profile,
      };

      if (typeId) {
        data.type = {
          id: this.typeId,
        };
      }

      const response = await okta.createUser({
        $,
        data,
        params: {
          activate,
        },
      });

      $.export("$summary", `Successfully created user with ID ${response.id}`);
      return response;
    } catch ({ message }) {
      const messageError = JSON.parse(message);
      throw new ConfigurationError(messageError.errorCauses.length
        ? messageError.errorCauses[0].errorSummary
        : messageError.errorSummary);
    }
  },
};
