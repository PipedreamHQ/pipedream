import app from "../../outseta.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "outseta-add-person",
  name: "Add Person",
  description: "Add a person record to CRM. [See the documentation](https://documenter.getpostman.com/view/3613332/outseta-rest-api-v1/7TNfr6k#26b724e6-9a76-2156-c4dd-b40f3d53fc70)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "The email of the person to be added",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the person to be added",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the person to be added",
      optional: true,
    },
    mailingAddress: {
      type: "object",
      label: "Mailing Address",
      description: "The mailing address of the account",
      optional: true,
      default: constants.ADDRESS_DEFAULT_OBJ,
    },
  },
  async run({ $ }) {
    const data = {
      Email: this.email,
      FirstName: this.firstName,
      LastName: this.lastName,
      MailingAddress: this.mailingAddress,
    };

    const response = await this.app.addPerson({
      $,
      data,
    });

    $.export("$summary", `Successfully added a person with UID: ${response.Uid}`);
    return response;
  },
};
