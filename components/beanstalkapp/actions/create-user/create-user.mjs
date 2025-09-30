import app from "../../beanstalkapp.app.mjs";

export default {
  key: "beanstalkapp-create-user",
  name: "Create User",
  description: "Creates a new user. [See the docs](https://api.beanstalkapp.com/user.html).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    login: {
      propDefinition: [
        app,
        "login",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    password: {
      propDefinition: [
        app,
        "password",
      ],
    },
    admin: {
      propDefinition: [
        app,
        "admin",
      ],
    },
    timezone: {
      propDefinition: [
        app,
        "timezone",
      ],
    },
  },
  methods: {
    createUser(args = {}) {
      return this.app.create({
        path: "/users",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      login,
      email,
      name,
      password,
      admin,
      timezone,
    } = this;

    const response = await this.createUser({
      step,
      data: {
        user: {
          login,
          email,
          name,
          password,
          admin,
          timezone,
        },
      },
    });

    step.export("$summary", `Successfully created a user with ID ${response.user.id}`);

    return response;
  },
};
