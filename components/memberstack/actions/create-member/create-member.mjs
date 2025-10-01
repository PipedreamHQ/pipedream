import memberstack from "../../memberstack.app.mjs";
import pickBy from "lodash.pickby";

export default {
  key: "memberstack-create-member",
  name: "Create Member",
  description: "Creates a member connected to a free plan. [See the docs](https://memberstack.notion.site/Admin-API-5b9233507d734091bd6ed604fb893bb8)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    memberstack,
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the new member",
    },
    password: {
      type: "string",
      label: "Password",
      description: "Password for the new member. Must be at least 8 characters long.",
    },
    plans: {
      type: "string[]",
      label: "Plans",
      description: "An array of planId objects. Example: `{{ [{\"planId\": \"pln_abc\"}] }}`",
      optional: true,
    },
    customFields: {
      propDefinition: [
        memberstack,
        "customFields",
      ],
    },
    metaData: {
      propDefinition: [
        memberstack,
        "metaData",
      ],
    },
    loginRedirect: {
      type: "string",
      label: "Login Redirect",
      description: "Optional login redirect URL",
      optional: true,
    },
  },
  async run({ $ }) {
    const plans = this.plans?.length > 0
      ? this.plans.map((plan) => (typeof plan === "object")
        ? plan
        : JSON.parse(plan))
      : undefined;

    let response;
    try {
      const { data } = await this.memberstack.createMember(pickBy({
        email: this.email,
        password: this.password,
        plans,
        customFields: this.customFields,
        metaData: this.metaData,
        loginRedirect: this.loginRedirect,
      }));
      response = data;
    } catch (e) {
      throw new Error(e.message);
    }

    if (response) {
      $.export("$summary", `Successfully created member with ID ${response?.id}.`);
    }

    return response;
  },
};
