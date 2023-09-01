import microsoftEntraId from "../../microsoft_entra_id.app.mjs";
import pickBy from "lodash.pickby";

export default {
  key: "microsoft_entra_id-update-user",
  name: "Update User",
  description: "Updates an existing user in Microsoft Entra ID. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-update?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  type: "action",
  props: {
    microsoftEntraId,
    userId: {
      propDefinition: [
        microsoftEntraId,
        "userId",
        (c) => ({
          groupId: c.groupId,
        }),
      ],
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The name to display in the address book for the user.",
    },
    mail: {
      type: "string",
      label: "Email",
      description: "The SMTP address for the user, for example, `jeff@contoso.onmicrosoft.com`.",
    },
    mailNickname: {
      type: "string",
      label: "Mail Nickname",
      description: "The mail alias for the user.",
    },
    userPrincipleName: {
      type: "string",
      label: "User Principle Name",
      description: "The user principal name (someuser@contoso.com). It's an Internet-style login name for the user based on the Internet standard RFC 822. By convention, this should map to the user's email name. The general format is alias@domain, where domain must be present in the tenant's collection of verified domains. The verified domains for the tenant can be accessed from the verifiedDomains property of [organization](https://learn.microsoft.com/en-us/graph/api/resources/organization?view=graph-rest-1.0). NOTE: This property cannot contain accent characters. Only the following characters are allowed `A - Z`, `a - z`, `0 - 9`, `' . - _ ! # ^ ~.` For the complete list of allowed characters, see [username policies](https://learn.microsoft.com/en-us/azure/active-directory/authentication/concept-sspr-policy#userprincipalname-policies-that-apply-to-all-user-accounts).",
    },
    accountEnabled: {
      type: "boolean",
      label: "Account Enabled",
      description: "`true` if the account is enabled; otherwise, `false`.",
      optional: true,
      default: true,
    },
    streetAddress: {
      type: "string",
      label: "Street Address",
      description: "The street address of the user's place of business.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city in which the user is located.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state or province in the user's address.",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code for the user's postal address. The postal code is specific to the user's country/region. In the United States of America, this attribute contains the ZIP code.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country/region in which the user is located; for example, `US` or `UK`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.microsoftEntraId.updateUser({
      userId: this.userId,
      data: pickBy({
        displayName: this.displayName,
        mail: this.mail,
        mailNickname: this.mailNickname,
        userPrincipleName: this.userPrincipleName,
        accountEnabled: this.accountEnabled,
        streetAddress: this.streetAddress,
        city: this.city,
        state: this.state,
        postalCode: this.postalCode,
        country: this.country,
      }),
      $,
    });

    $.export("$summary", `Successfully updated user with ID ${this.userId}.`);

    return response;
  },
};
