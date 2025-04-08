import { ConfigurationError } from "@pipedream/platform";
import lucca from "../../lucca.app.mjs";

export default {
  key: "lucca-update-user-info",
  name: "Update User Info",
  description: "Update profile or HR information for an existing user. [See the documentation](https://developers.lucca.fr/api-reference/legacy/directory/update-a-user-by-id)",
  version: "0.0.1",
  type: "action",
  props: {
    lucca,
    userId: {
      propDefinition: [
        lucca,
        "userId",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The user's first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The user's last name",
      optional: true,
    },
    mail: {
      type: "string",
      label: "Email",
      description: "The user's email",
      optional: true,
    },
    login: {
      type: "string",
      label: "Login",
      description: "The user's login",
      optional: true,
    },
    legalEntityId: {
      propDefinition: [
        lucca,
        "legalEntityId",
      ],
      optional: true,
    },
    calendarId: {
      type: "integer",
      label: "Calendar ID",
      description: "The ID of the calendar",
      optional: true,
    },
    employeeNumber: {
      type: "string",
      label: "Employee Number",
      description: "The employee number",
      optional: true,
    },
    birthDate: {
      type: "string",
      label: "Birth Date",
      description: "The birth date of the user. Format: 'YYYY-MM-DD'.",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the user",
      optional: true,
    },
    bankName: {
      type: "string",
      label: "Bank Name",
      description: "The name of the bank",
      optional: true,
    },
    directLine: {
      type: "string",
      label: "Direct Line",
      description: "The direct line of the user",
      optional: true,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "The gender of the user",
      optional: true,
    },
    nationality: {
      propDefinition: [
        lucca,
        "nationalityId",
      ],
      optional: true,
    },
    personalEmail: {
      type: "string",
      label: "Personal Email",
      description: "The personal email of the user",
      optional: true,
    },
    personalMobile: {
      type: "string",
      label: "Personal Mobile",
      description: "The personal mobile of the user",
      optional: true,
    },
    professionalMobile: {
      type: "string",
      label: "Professional Mobile",
      description: "The professional mobile of the user",
      optional: true,
    },
    quote: {
      type: "string",
      label: "Quote",
      description: "The quote of the user",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const {
        lucca,
        userId,
        ...data
      } = this;

      const response = await lucca.updateUserProfile({
        $,
        userId,
        data,
      });

      $.export("$summary", `Successfully updated user with ID: ${this.userId}`);
      return response;
    } catch ({ message }) {
      console.log("message: ", message);

      const parsedError = JSON.parse(message);
      throw new ConfigurationError(parsedError.Message || parsedError[0].message);
    }
  },
};
