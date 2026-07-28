// x-pd-ai: optimized
import brexApp from "../../brex.app.mjs";

export default {
  key: "brex-list-users",
  name: "List Users",
  description: "List the people in the Brex account, including each person's ID, name, "
    + "email, status, manager, department, and location."
    + " This is how you turn an email address or a name into the user ID that **Get Card**,"
    + " **List Cards**, **Create Card**, and **Set Limit for User** all require."
    + " Set Email to look up one specific person; Brex matches a single exact address at a"
    + " time, not a list or a partial match."
    + " Enable Include Limits to return each person's monthly spend limit and remaining"
    + " available amount inline, alongside their profile."
    + " [See the documentation](https://developer.brex.com/openapi/team_api/users/listusers)",
  version: "0.0.1",
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
      description: "Return each user's monthly spend limit alongside their profile. Amounts are in the currency's smallest denomination, so `700` is $7.00 in USD.",
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

    const scope = this.email
      ? ` matching ${this.email}`
      : "";
    const moreNote = truncated
      ? ", more available — raise Max Results to fetch them"
      : "";

    $.export("$summary", `Found ${items.length} user(s)${scope}${moreNote}`);

    return items;
  },
};
