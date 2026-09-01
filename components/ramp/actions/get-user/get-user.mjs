// x-pd-ai: optimized
import ramp from "../../ramp.app.mjs";

export default {
  key: "ramp-get-user",
  name: "Get User",
  description: "Retrieve a single Ramp user by ID. Run the **List Users** action first to find a valid user ID. Example: given a user id from **List Users**, returns that user's full record — name, email, role (e.g. `BUSINESS_OWNER`), department id, and location id. [See the documentation](https://docs.ramp.com/developer-api/v1/api/users#get-developer-v1-users-user-id)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ramp,
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user to retrieve — a UUID, e.g. `bcc1e4ca-d38a-4cc9-98fc-e6c2066ad0ae`. Run the **List Users** action to find this value.",
    },
  },
  async run({ $ }) {
    const response = await this.ramp.getUser({
      $,
      userId: this.userId,
    });
    $.export("$summary", `Successfully retrieved user ${this.userId}`);
    return response;
  },
};
