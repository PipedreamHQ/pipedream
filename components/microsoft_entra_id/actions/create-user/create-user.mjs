import microsoftEntraId from "../../microsoft_entra_id.app.mjs";

export default {
  key: "microsoft_entra_id-create-user",
  name: "Create User",
  description: "Creates a new user in Microsoft Entra ID. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-post-users?view=graph-rest-1.0&tabs=http)",
  //version: "0.0.1",
  version: "0.0.9",
  type: "action",
  props: {
    microsoftEntraId,
    displayName: {
      propDefinition: [
        microsoftEntraId,
        "displayName",
      ],
    },
    mail: {
      propDefinition: [
        microsoftEntraId,
        "mail",
      ],
    },
    mailNickname: {
      propDefinition: [
        microsoftEntraId,
        "mailNickname",
      ],
    },
    userPrincipleName: {
      propDefinition: [
        microsoftEntraId,
        "userPrincipleName",
      ],
    },
    password: {
      propDefinition: [
        microsoftEntraId,
        "password",
      ],
    },
    forceChangePasswordNextSignIn: {
      propDefinition: [
        microsoftEntraId,
        "forceChangePasswordNextSignIn",
      ],
    },
    forceChangePasswordNextSignInWithMfa: {
      propDefinition: [
        microsoftEntraId,
        "forceChangePasswordNextSignInWithMfa",
      ],
    },
    accountEnabled: {
      propDefinition: [
        microsoftEntraId,
        "accountEnabled",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      //accountEnabled: this.accountEnabled,
      displayName: this.displayName,
      //mail: this.mail,
      //mailNickname: this.mailNickname,
      userPrincipleName: this.userPrincipleName,
      //passwordProfile: {
      //  password: this.password,
      //  forceChangePasswordNextSignIn: this.forceChangePasswordNextSignIn,
      //  forceChangePasswordNextSignInWithMfa: this.forceChangePasswordNextSignInWithMfa,
      //},
    };

    const response = await this.microsoftEntraId.createUser({
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created user with ID ${response.id}.`);
    }

    return response;
  },
};
