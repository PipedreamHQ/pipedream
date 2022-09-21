import zenler from "../../zenler.app.mjs";

export default {
  key: "zenler-create-user",
  name: "Create User",
  description: "Creates a user. [See the docs here](https://www.newzenler.com/api/documentation/public/api-doc.html#d350a2f6-bc29-b363-6724-681535bc03e0)",
  type: "action",
  version: "0.0.1",
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
      type: "string",
      label: "Commission",
      description: "Commission of the user",
    },
    roles: {
      type: "string",
      label: "Roles",
      description: "Roles of the user",
      options: [
        {
          label: "3",
          value: "3",
        },
        {
          label: "7",
          value: "7",
        },
      ],
    },
    address: {
      label: "Address",
      description: "Address of the user",
      optional: true,
    },
    city: {
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
      roles,
      address,
      city,
    } = this;

    const response = await this.zenler.createUser({
      data: {
        firstName,
        lastName,
        email,
        password,
        commission,
        roles,
        address,
        city,
      },
    });

    $.export("$summary", `Successfully created a new user with ID ${response.id}`);

    return response;
  },
};
