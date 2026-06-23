import stadium from "../../stadium.app.mjs";

export default {
  key: "stadium-get-user-profile",
  name: "Get User Profile",
  description: "Get the current user's profile including wallet balance. [See the documentation](https://api.bystadium.com/api/v2/docs#tag/User-management/operation/getUserProfile)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    stadium,
  },
  async run({ $ }) {
    const response = await this.stadium.getUserProfile({
      $,
    });
    $.export("$summary", `Successfully retrieved profile for ${response.email}`);
    return response;
  },
};
