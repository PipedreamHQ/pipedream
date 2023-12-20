import heygen from "../../heygen.app.mjs";

export default {
  key: "heygen-retrieve-shareable-video-link",
  name: "Retrieve Shareable Video Link",
  description: "Fetches a shareable link for a specific heygen video",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    heygen,
    videoId: heygen.propDefinitions.videoId,
  },
  async run({ $ }) {
    const response = await this.heygen.fetchShareableLink(this.videoId);
    $.export("$summary", `Successfully fetched shareable link for video ID: ${this.videoId}`);
    return response;
  },
};
