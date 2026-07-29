import brexApp from "../../brex.app.mjs";
import { formatSearchSummary } from "../../common/utils.mjs";

export default {
  key: "brex-list-users",
  name: "List Users",
  description: "Lists the people in the Brex account with their ID, name, email, status, manager, department, and location. This is how you turn an email address into the user ID that the card and limit tools require. [See the documentation](https://developer.brex.com/openapi/team_api/users/listusers)",
  version: "0.0.2",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    brexApp,
    email: {
      propDefinition: [
        brexApp,
        "email",
      ],
    },
    includeLimits: {
      type: "boolean",
      label: "Include Limits",
      description: "Return each person's monthly spend limit alongside their profile. Amounts are in the currency's smallest denomination, so `700` is $7.00 in USD.",
      optional: true,
      default: false,
    },
    maxResults: {
      propDefinition: [
        brexApp,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const {
      items, truncated,
    } = await this.brexApp.listUsersPaginated({
      $,
      params: {
        "email": this.email,
        "expand[]": this.includeLimits
          ? [
            "limit",
          ]
          : undefined,
      },
      max: this.maxResults,
    });

    $.export("$summary", formatSearchSummary({
      count: items.length,
      noun: "user(s)",
      scope: this.email
        ? ` matching ${this.email}`
        : "",
      truncated,
    }));

    return items;
  },
};
