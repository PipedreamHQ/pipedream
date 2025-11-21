import { ConfigurationError } from "@pipedream/platform";
import { parseError } from "../../common/utils.mjs";
import kiwihr from "../../kiwihr.app.mjs";

export default {
  key: "kiwihr-update-employee-record",
  name: "Update Employee Record",
  description: "Update an existing employee's record in kiwiHR. [See the documentation](https://api.kiwihr.it/api/docs/mutation.doc.html)",
  version: "1.0.0",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    kiwihr,
    employeeId: {
      propDefinition: [
        kiwihr,
        "employeeId",
      ],
    },
    firstName: {
      propDefinition: [
        kiwihr,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        kiwihr,
        "lastName",
      ],
      optional: true,
    },
    workPhones: {
      propDefinition: [
        kiwihr,
        "workPhones",
      ],
      optional: true,
    },
    employmentStartDate: {
      propDefinition: [
        kiwihr,
        "employmentStartDate",
      ],
      optional: true,
    },
    aboutMe: {
      propDefinition: [
        kiwihr,
        "aboutMe",
      ],
      optional: true,
    },
    gender: {
      propDefinition: [
        kiwihr,
        "gender",
      ],
      optional: true,
    },
    managerId: {
      propDefinition: [
        kiwihr,
        "managerId",
      ],
      optional: true,
    },
    nationality: {
      propDefinition: [
        kiwihr,
        "nationality",
      ],
      optional: true,
    },
    teamIds: {
      propDefinition: [
        kiwihr,
        "teamIds",
      ],
      optional: true,
    },
    positionId: {
      propDefinition: [
        kiwihr,
        "positionId",
      ],
      optional: true,
    },
    locationId: {
      propDefinition: [
        kiwihr,
        "locationId",
      ],
      optional: true,
    },
    birthDate: {
      propDefinition: [
        kiwihr,
        "birthDate",
      ],
      optional: true,
    },
    personalPhone: {
      propDefinition: [
        kiwihr,
        "personalPhone",
      ],
      optional: true,
    },
    personalEmail: {
      propDefinition: [
        kiwihr,
        "personalEmail",
      ],
      optional: true,
    },
    addressStreet: {
      propDefinition: [
        kiwihr,
        "addressStreet",
      ],
      optional: true,
    },
    addressCity: {
      propDefinition: [
        kiwihr,
        "addressCity",
      ],
      optional: true,
    },
    addressState: {
      propDefinition: [
        kiwihr,
        "addressState",
      ],
      optional: true,
    },
    addressPostalCode: {
      propDefinition: [
        kiwihr,
        "addressPostalCode",
      ],
      optional: true,
    },
    addressCountry: {
      propDefinition: [
        kiwihr,
        "addressCountry",
      ],
      optional: true,
    },
    pronouns: {
      propDefinition: [
        kiwihr,
        "pronouns",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const {
        kiwihr,
        employeeId,
        addressStreet,
        addressCity,
        addressState,
        addressPostalCode,
        addressCountry,
        ...user
      } = this;

      const address = {};
      if (addressStreet) address.street = addressStreet;
      if (addressCity) address.city = addressCity;
      if (addressState) address.state = addressState;
      if (addressPostalCode) address.postalCode = addressPostalCode;
      if (addressCountry) address.country = addressCountry;

      if (Object.keys(address).length > 0) {
        user.address = address;
      }

      const response = await kiwihr.updateEmployee({
        id: employeeId,
        user,
      });

      $.export("$summary", `Successfully updated employee record for ID: ${this.employeeId}`);
      return response;
    } catch ({ response }) {
      const error = parseError(response);
      throw new ConfigurationError(error);
    }
  },
};
