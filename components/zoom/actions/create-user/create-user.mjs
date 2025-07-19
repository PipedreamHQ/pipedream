import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-create-user",
  name: "Create User",
  description: "Creates a new user in your account. Requires a paid Zoom account. [See the documentation](https://developers.zoom.us/docs/api/users/#tag/users/POST/users)",
  version: "0.2.5",
  type: "action",
  props: {
    zoom,
    paidAccountAlert: {
      propDefinition: [
        zoom,
        "paidAccountAlert",
      ],
    },
    action: {
      type: "string",
      label: "Action",
      description: "Specify how to create the new user: <br>`create` - User will get an email sent from Zoom. There is a confirmation link in this email. The user will then need to use the link to activate their Zoom account. The user can then set or change their password.<br>`autoCreate` - This action is provided for the enterprise customer who has a managed domain. This feature is disabled by default because of the security risk involved in creating a user who does not belong to your domain.<br>`custCreate` - Users created via this option do not have passwords and will not have the ability to log into the Zoom Web Portal or the Zoom Client. To use this option, you must contact the ISV Platform Sales team at isv@zoom.us.<br>`ssoCreate` - This action is provided for the enabled Pre-provisioning SSO User option. A user created in this way has no password. If not a basic user, a personal vanity URL using the user name (no domain) of the provisioning email will be generated. If the user name or PMI is invalid or occupied, it will use a random number or random personal vanity URL.",
      options: [
        "create",
        "autoCreate",
        "custCreate",
        "ssoCreate",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The user's email address",
    },
    type: {
      type: "integer",
      label: "Type",
      description: "The type of user",
      options: [
        {
          label: "Basic",
          value: 1,
        },
        {
          label: "Licensed",
          value: 2,
        },
        {
          label: "Unassigned without Meetings Basic",
          value: 4,
        },
        {
          label: "None. this can only be set with ssoCreate",
          value: 99,
        },
      ],
    },
    firstName: {
      propDefinition: [
        zoom,
        "firstName",
      ],
      description: "The user's first name",
      optional: true,
    },
    lastName: {
      propDefinition: [
        zoom,
        "lastName",
      ],
      description: "The user's last name",
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "User password. Only used for the \"autoCreate\" function. The password has to have a minimum of 8 characters and maximum of 32 characters. By default (basic requirement), password must have at least one letter (a, b, c..), at least one number (1, 2, 3...) and include both uppercase and lowercase letters. It should not contain only one identical character repeatedly ('11111111' or 'aaaaaaaa') and it cannot contain consecutive characters ('12345678' or 'abcdefgh').",
      optional: true,
    },
  },
  methods: {
    createUser(args = {}) {
      return this.zoom.create({
        path: "/users",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const response = await this.createUser({
      $,
      data: {
        action: this.action,
        user_info: {
          email: this.email,
          first_name: this.firstName,
          last_name: this.lastName,
          password: this.password,
          type: this.type,
        },
      },
    });
    $.export("$summary", `Successfully created user with ID \`${response.id}\``);
    return response;
  },
};
