import app from "../../kizeo_forms.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "kizeo_forms-create-user",
  name: "Create User",
  description: "Creates a new user in the Kizeo Forms platform. [See the documentation](https://kizeo.github.io/kizeo-forms-documentations/docs/en/users#2---add-a-user)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    login: {
      type: "string",
      label: "Login",
      description: "The login of the user",
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password of the user",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the user",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the user",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the user",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the user",
    },
    admin: {
      type: "boolean",
      label: "Admin",
      description: "Whether the user is an admin",
      optional: true,
    },
    formUser: {
      type: "boolean",
      label: "Form User",
      description: "Whether the user is a form user",
      optional: true,
    },
    allowFormMenu: {
      type: "boolean",
      label: "Allow Form Menu",
      description: "Whether the user can access the form menu",
      optional: true,
    },
    allowExternalListMenu: {
      type: "boolean",
      label: "Allow External List Menu",
      description: "Whether the user can access the external list menu",
      optional: true,
    },
    allowUserMenu: {
      type: "boolean",
      label: "Allow User Menu",
      description: "Whether the user can access the user menu",
      optional: true,
    },
    allowApplicationMenu: {
      type: "boolean",
      label: "Allow Application Menu",
      description: "Whether the user can access the application menu",
      optional: true,
    },
    allowExportMenu: {
      type: "boolean",
      label: "Allow Export Menu",
      description: "Whether the user can access the export menu",
      optional: true,
    },
    allowDataMenu: {
      type: "boolean",
      label: "Allow Data Menu",
      description: "Whether the user can access the data menu",
      optional: true,
    },
    allowAccountMenu: {
      type: "boolean",
      label: "Allow Account Menu",
      description: "Whether the user can access the account menu",
      optional: true,
    },
  },
  methods: {
    createNewUser(args = {}) {
      return this.app.post({
        path: "/users",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createNewUser,
      ...data
    } = this;

    const response = await createNewUser({
      $,
      data: utils.keysToSnakeCase(data),
    });

    $.export("$summary", `Created user with message \`${response.message}\``);

    return response;
  },
};
