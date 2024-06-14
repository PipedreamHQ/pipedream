import okta from "../../okta.app.mjs";

export default {
  key: "okta-create-user",
  name: "Create User",
  description: "Creates a new user in the Okta system. The user will receive an email with the account creation prompt.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    okta,
    firstName: okta.propDefinitions.firstName,
    lastName: okta.propDefinitions.lastName,
    email: okta.propDefinitions.email,
    login: {
      ...okta.propDefinitions.login,
      optional: true,
    },
    mobilePhone: {
      ...okta.propDefinitions.mobilePhone,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.okta.createUser({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      login: this.login,
      mobilePhone: this.mobilePhone,
    });
    $.export("$summary", `Successfully created user ${this.firstName} ${this.lastName}`);
    return response;
  },
};
