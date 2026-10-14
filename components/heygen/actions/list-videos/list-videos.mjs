import heygen from "../../heygen.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "heygen-list-videos",
  name: "List Videos",
  description: "Retrieves a page of videos, newest first, with their `id`, `status`, and download links once completed. Use this to find a video ID for other actions. Note: the HeyGen v3 list may not include videos created in the HeyGen web app (it can return an empty list even when such videos exist); if you already know a video's ID, use **Retrieve Video Link** instead, which works for any video ID. Pass **Fields** to keep the response small. If `has_more` is true, pass `next_token` as the Token to get the next page. Example: Title `Onboarding` with Limit `2` and Fields `[\"id\", \"title\", \"status\"]` returns `{\"data\": [{\"id\": \"v_123\", \"title\": \"Onboarding intro\", \"status\": \"completed\"}, {\"id\": \"v_122\", \"title\": \"Onboarding part 2\", \"status\": \"processing\"}], \"has_more\": true, \"next_token\": \"abc\"}`. [See the documentation](https://developers.heygen.com/reference/list-videos)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    heygen,
    folderId: {
      propDefinition: [
        heygen,
        "folderId",
      ],
    },
    titleFilter: {
      propDefinition: [
        heygen,
        "titleFilter",
      ],
    },
    videoFields: {
      propDefinition: [
        heygen,
        "videoFields",
      ],
    },
    limit: {
      propDefinition: [
        heygen,
        "limit",
      ],
    },
    token: {
      propDefinition: [
        heygen,
        "token",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.heygen.listVideos({
      $,
      params: {
        folder_id: this.folderId,
        title: this.titleFilter,
        limit: this.limit,
        token: this.token,
      },
    });
    const data = utils.pluckFields(response.data, this.videoFields);
    $.export("$summary", `Successfully retrieved ${data.length} video${data.length === 1
      ? ""
      : "s"}`);
    return {
      ...response,
      data,
    };
  },
};
