import f15five from "../../f15five.app.mjs";

export default {
  key: "f15five-get-user",
  name: "Get User",
  description: "Retrieve a user object. [See the documentation](https://my.15five.com/api/public/#tag/User/paths/~1api~1public~1user~1%7Bid%7D~1/get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    f15five,
    user: {
      propDefinition: [
        f15five,
        "user",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.f15five.getUser({
      userId: this.user,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved user with ID ${response.id}`);
    }

    return response;
  },
};
