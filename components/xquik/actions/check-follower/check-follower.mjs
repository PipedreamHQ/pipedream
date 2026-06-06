import xquik from "../../xquik.app.mjs";

export default {
  key: "xquik-check-follower",
  name: "Check Follower",
  description: "Check if one public X/Twitter user follows another with Xquik. [See the documentation](https://docs.xquik.com/api-reference/x/check-follower)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    xquik,
    sourceUsername: {
      propDefinition: [
        xquik,
        "sourceUsername",
      ],
    },
    targetUsername: {
      propDefinition: [
        xquik,
        "targetUsername",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.xquik.checkFollower({
      $,
      sourceUsername: this.sourceUsername,
      targetUsername: this.targetUsername,
    });

    const source = response?.sourceUsername ?? this.sourceUsername;
    const target = response?.targetUsername ?? this.targetUsername;
    const result = response?.isFollowing
      ? "follows"
      : "does not follow";

    $.export("$summary", `${source} ${result} ${target}`);
    return response;
  },
};
