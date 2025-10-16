import zep from "../../zep.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "zep-add-user",
  name: "Add User",
  description: "Adds a user in Zep. [See the documentation](https://help.getzep.com/api-reference/user/add)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zep,
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier of the new user",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the user",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the new user",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the new user",
      optional: true,
    },
    factRatingInstructions: {
      propDefinition: [
        zep,
        "factRatingInstructions",
      ],
    },
    metadata: {
      propDefinition: [
        zep,
        "metadata",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.zep.createUser({
      $,
      data: {
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        fact_rating_instructions: utils.parseObject(this.factRatingInstructions),
        metadata: utils.parseObject(this.metadata),
        user_id: this.userId,
      },
    });
    $.export("$summary", `Successfully added user with ID: ${response.id}`);
    return response;
  },
};
