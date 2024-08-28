import gozenGrowth from "../../gozen_growth.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "gozen_growth-create-contact",
  name: "Create Contact",
  description: "Create a new contact on Gozen Growth. [See the documentation](https://docs.gozen.io/docs/automation/how-to-use-webhook-trigger)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    gozenGrowth,
    emailAddress: {
      propDefinition: [
        gozenGrowth,
        "emailAddress",
      ],
    },
    firstName: {
      propDefinition: [
        gozenGrowth,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        gozenGrowth,
        "lastName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.gozenGrowth.createOrUpdateContact({
      emailAddress: this.emailAddress,
      firstName: this.firstName,
      lastName: this.lastName,
    });

    $.export("$summary", `Successfully created or updated contact with email: ${this.emailAddress}`);
    return response;
  },
};
