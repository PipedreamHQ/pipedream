import app from "../../miestro.app.mjs";

export default {
  key: "miestro-create-user",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Create User",
  description: "Creates a user with the given attributes. [See the documentation](https://support.miestro.com/article/279-api-documentation)",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "Full name of the user",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the user",
    },
    password: {
      type: "string",
      label: "Password",
      description: "Password of the account",
      secret: true,
    },
    role: {
      type: "string",
      label: "Role",
      description: "Role of the user",
      options: [
        {
          label: "User",
          value: "0",
        },
        {
          label: "Owner",
          value: "1",
        },
        {
          label: "Admin",
          value: "2",
        },
        {
          label: "Assistant",
          value: "3",
        },
        {
          label: "Support Specialist",
          value: "4",
        },
      ],
    },
  },
  async run ({ $ }) {
    const resp = await this.app.createUser({
      $,
      data: {
        name: this.name,
        email: this.email,
        password: this.password,
        role: this.role,
      },
    });
    $.export("$summary", `User(ID:${resp.id}) has been created successfully.`);
    return resp;
  },
};
