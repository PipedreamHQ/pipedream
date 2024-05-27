import ispringLearn from "../../ispring_learn.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ispring_learn-update-user",
  name: "Update User",
  description: "Allows to modify the properties of a specific user on iSpring Learn.",
  version: "0.0.${ts}",
  type: "action",
  props: {
    ispringLearn,
    userId: {
      propDefinition: [
        ispringLearn,
        "userId",
      ],
    },
    fieldsToUpdate: {
      propDefinition: [
        ispringLearn,
        "fieldsToUpdate",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ispringLearn.updateUser({
      userId: this.userId,
      fieldsToUpdate: this.fieldsToUpdate,
    });
    $.export("$summary", `Successfully updated user with ID ${this.userId}`);
    return response;
  },
};
