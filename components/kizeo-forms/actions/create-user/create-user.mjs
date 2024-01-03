import kizeoForms from "../../kizeo-forms.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "kizeo-forms-create-user",
  name: "Create User",
  description: "Creates a new user in the Kizeo Forms platform. [See the documentation](https://kizeo.github.io/kizeo-forms-documentations/docs/en/users)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    kizeoForms,
    newUserDetails: {
      propDefinition: [
        kizeoForms,
        "newUserDetails",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.kizeoForms.createNewUser({
      newUserDetails: this.newUserDetails,
    });
    $.export("$summary", `Created user with ID ${response.id}`);
    return response;
  },
};
