import qntrl from "../../qntrl.app.mjs";

export default {
  key: "qntrl-add-user",
  name: "Add User",
  description: "Adds a new user to the system. The 'username' and 'email' props are mandatory.",
  version: "0.0.1",
  type: "action",
  props: {
    qntrl,
    username: {
      propDefinition: [
        qntrl,
        "username",
      ],
    },
    email: {
      propDefinition: [
        qntrl,
        "email",
      ],
    },
    firstName: {
      propDefinition: [
        qntrl,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        qntrl,
        "lastName",
      ],
      optional: true,
    },
    password: {
      propDefinition: [
        qntrl,
        "password",
      ],
      optional: true,
      secret: true,
    },
    userRole: {
      propDefinition: [
        qntrl,
        "userRole",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.qntrl.addUser({
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
      userRole: this.userRole,
    });
    $.export("$summary", `Successfully added user ${this.username}`);
    return response;
  },
};
