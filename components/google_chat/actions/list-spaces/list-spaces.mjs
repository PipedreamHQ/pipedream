import app from "../../google_chat.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "google_chat-list-spaces",
  name: "List Spaces",
  description: "Lists spaces the caller is a member of. Group chats and DMs aren't listed until the first message is sent. [See the documentation](https://developers.google.com/chat/api/reference/rest/v1/spaces/list)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The maximum number of spaces to return. If unspecified, at most 100 spaces are returned.",
      optional: true,
    },
    pageToken: {
      type: "string",
      label: "Page Token",
      description: "A page token received from a previous list spaces call. Provide this parameter to retrieve the subsequent page.",
      optional: true,
    },
    spaceType: {
      type: "string[]",
      label: "Space Type",
      description: "You can filter spaces by the space type.",
      optional: true,
      options: constants.LIST_SPACES_SPACE_TYPE_OPTIONS,
    },
  },
  async run({ $ }) {
    const response = await this.app.listSpaces({
      $,
      params: {
        pageSize: this.pageSize,
        pageToken: this.pageToken,
        filter: this.spaceType?.map((type) => `spaceType = "${type}"`).join(" OR "),
      },
    });
    $.export("$summary", `Successfully fetched ${response.spaces.length} spaces`);
    return response;
  },
};
