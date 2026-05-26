import common from "../common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  name: "Unblock User",
  key: "twitch-unblock-user",
  description: "Unblocks the specified user. [See the documentation](https://dev.twitch.tv/docs/api/reference/#unblock-user)",
  version: "0.2.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    user: {
      type: "string",
      label: "User",
      description: "The Twitch user to unblock. Accepts a numeric user ID (e.g. `141981764`) or login name (e.g. `twitchdev`).",
      async options({ page }) {
        const broadcasterId = await this.getUserId();
        let cursor;
        for (let i = 0; i < page; i++) {
          const { data } = await this.twitch.getUserBlocks({
            broadcaster_id: broadcasterId,
            first: constants.USER_BLOCKS_PAGE_SIZE,
            after: cursor,
          });
          cursor = data.pagination?.cursor;
          if (!cursor) {
            return [];
          }
        }
        const { data } = await this.twitch.getUserBlocks({
          broadcaster_id: broadcasterId,
          first: constants.USER_BLOCKS_PAGE_SIZE,
          after: cursor,
        });
        return data.data.map((u) => ({
          label: `${u.display_name} (${u.user_login})`,
          value: u.user_id,
        }));
      },
    },
  },
  async run({ $ }) {
    const targetUserId = await this.twitch.resolveUserId(this.user);
    const params = {
      target_user_id: targetUserId,
    };
    const {
      status,
      statusText,
    } = await this.twitch.unblockUser(params);
    const summary = status == 204
      ? `Unblocked user ${targetUserId}`
      : `Unblock failed: ${status} ${statusText}`;
    $.export("$summary", summary);
    return summary;
  },
};
