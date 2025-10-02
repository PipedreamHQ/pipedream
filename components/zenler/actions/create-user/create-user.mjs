import zenler from "../../zenler.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "zenler-create-user",
  name: "Create User",
  description: "Creates a user. [See the docs here](https://www.newzenler.com/api/documentation/public/api-doc.html#d350a2f6-bc29-b363-6724-681535bc03e0)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    zenler,
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the user",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the user",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the user",
    },
    password: {
      type: "string",
      label: "Password",
      description: "Password of the user",
    },
    commission: {
      type: "integer",
      label: "Commission",
      description: "Commission of the user",
    },
    roles: {
      type: "string[]",
      label: "Roles",
      description: "Roles of the user",
      options: constants.ROLES_OPTIONS,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Address of the user",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the user",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      firstName,
      lastName,
      email,
      password,
      commission,
      address,
      city,
    } = this;

    const roles =
      Array.isArray(this.roles)
      && this.roles.map(parseInt)
      || [];

    const response = await this.zenler.createUser({
      data: {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        commission,
        roles,
        address,
        city,
      },
    });

    if (typeof(response) === "string") {
      console.log(response);
      throw new Error("Response error");
    }

    const { data } = response;

    $.export("$summary", `Successfully created a new user with ID ${data.id}`);

    return response;
  },
};
