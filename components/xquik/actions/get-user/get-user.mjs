import xquik from "../../xquik.app.mjs";

export default {
  key: "xquik-get-user",
  name: "Get User",
  description:
    "Get a public X/Twitter user profile by username or ID with Xquik. [See the documentation](https://docs.xquik.com/api-reference/overview)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    xquik,
    userId: {
      propDefinition: [xquik, "userId"],
    },
  },
  async run({ $ }) {
    const response = await this.xquik.getUser({
      $,
      userId: this.userId,
    });

    const user = response?.user ?? response?.data ?? response;
    const userRef = user?.username ?? user?.handle ?? user?.id ?? this.userId;

    $.export("$summary", `Successfully retrieved user ${userRef}`);
    return response;
  },
};
