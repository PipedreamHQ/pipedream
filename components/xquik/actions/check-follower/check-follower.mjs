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
    sourceUserId: {
      propDefinition: [
        xquik,
        "sourceUserId",
      ],
    },
    targetUserId: {
      propDefinition: [
        xquik,
        "targetUserId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.xquik.checkFollower({
      $,
      sourceUserId: this.sourceUserId,
      targetUserId: this.targetUserId,
    });

    const source = response?.sourceUsername ?? this.sourceUserId;
    const target = response?.targetUsername ?? this.targetUserId;
    const result = response?.isFollowing
      ? "follows"
      : "does not follow";

    $.export("$summary", `${source} ${result} ${target}`);
    return response;
  },
};
