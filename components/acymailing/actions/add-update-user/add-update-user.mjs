import acymailing from "../../acymailing.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "acymailing-add-update-user",
  name: "Add or Update User",
  description: "Creates a new user or updates an existing user in AcyMailing. Required props: user data, which should include at least a unique identifier (e.g., email). If the user exists, will update the user's data with provided information.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    acymailing,
    userData: acymailing.propDefinitions.userData,
  },
  async run({ $ }) {
    const response = await this.acymailing.createUserOrUpdate(this.userData);
    $.export("$summary", `Successfully added or updated user with email ${this.userData.email}`);
    return response;
  },
};
