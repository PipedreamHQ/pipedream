import daktela from "../../daktela.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "daktela-create-account",
  name: "Create Account",
  description: "Creates a new account on Daktela. [See the documentation](https://customer.daktela.com/apihelp/v6/global/general-information)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    daktela,
    user: {
      propDefinition: [
        daktela,
        "user",
      ],
      optional: true,
    },
    sla: {
      propDefinition: [
        daktela,
        "sla",
      ],
      optional: true,
    },
    survey: {
      propDefinition: [
        daktela,
        "survey",
      ],
      optional: true,
    },
    name: {
      propDefinition: [
        daktela,
        "name",
      ],
      optional: true,
    },
    title: {
      propDefinition: [
        daktela,
        "title",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        daktela,
        "description",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      user: this.user,
      sla: this.sla,
      survey: this.survey,
      name: this.name,
      title: this.title,
      description: this.description,
    };

    const response = await this.daktela.createAccount(params);

    $.export("$summary", `Successfully created account: ${response.title}`);
    return response;
  },
};
