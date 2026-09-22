import app from "../../acelle_mail.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Create Customer",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "acelle_mail-create-customer",
  description: "Creates a customer. [See the documentation](https://api.acellemail.com/#backend_customers)",
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "Customer email",
    },
    password: {
      type: "string",
      label: "Password",
      description: "Customer password",
    },
    firstName: {
      type: "string",
      label: "First name",
      description: "Customer first name",
    },
    lastName: {
      type: "string",
      label: "Last name",
      description: "Customer last name",
    },
    timezone: {
      type: "string",
      label: "Time zone",
      description: "Customer time zone. E.g `America/Godthab`",
      options: constants.TIMEZONES,
    },
    languageId: {
      type: "string",
      label: "Language ID",
      description: "Language identifier",
      options: constants.LANGUAGES_ID,
    },
  },
  async run({ $ }) {
    const response = await this.app.createCustomer({
      $,
      data: {
        email: this.email,
        password: this.password,
        first_name: this.firstName,
        last_name: this.lastName,
        timezone: this.timezone,
        language_id: this.languageId,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created customer customer with ID \`${response.customer_uid}\``);
    }

    return response;
  },
};
