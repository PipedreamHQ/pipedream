import tokportal from "../../tokportal.app.mjs";

export default {
  key: "tokportal-publish-all-bundle-videos",
  name: "Publish All Bundle Videos",
  description: "Publish every configured-but-unpublished video slot of an active (accepted) bundle so the account manager can post them."
    + " Configure slots first with **Configure Video**."
    + " [See the documentation](https://developers.tokportal.com/video-actions/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    tokportal,
    bundleId: {
      propDefinition: [
        tokportal,
        "bundleId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.tokportal.publishAllBundleVideos({
      $,
      bundleId: this.bundleId,
    });
    const data = response?.data ?? response;
    const count = data?.videos_published;
    $.export("$summary", `Published ${count ?? "all configured"} video(s) on bundle ${this.bundleId}`);
    return response;
  },
};
