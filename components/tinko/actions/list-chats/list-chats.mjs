import app from "../../tinko.app.mjs";
import { CHAT_STATUSES } from "../../common/constants.mjs";

export default {
  key: "tinko-list-chats",
  name: "List Chats",
  description: "List chats, most recently updated first, filtered by status, channel, attendant, tag or contact."
    + " Use the returned `id` with **Transfer Chat** or **Close Chat**."
    + " [See the documentation](https://docs.tinko.com.br/endpoints/chats/#listar-chats)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    status: {
      type: "string",
      label: "Status",
      description: "Return only chats in this status. One of `waiting` (waiting for an attendant), `entrance` (being attended) or `finished`, e.g. `waiting`.",
      options: CHAT_STATUSES,
      optional: true,
    },
    isOpen: {
      type: "boolean",
      label: "Open",
      description: "Set to `true` to return only open chats or `false` to return only closed chats, e.g. `true`. Leave empty to return both.",
      optional: true,
    },
    channelId: {
      propDefinition: [
        app,
        "channelId",
      ],
      description: "Return only chats of this channel, e.g. `01JABCDEFGHJKMNPQRSTVWXYZ0`. Use **List Channels** to find channel IDs (the `id` field).",
      optional: true,
    },
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
      description: "Return only chats assigned to this Tinko user, e.g. `01JABCDEFGHJKMNPQRSTVWXYZ0`. Use **List Users** to find user IDs (the `id` field).",
      optional: true,
    },
    tagId: {
      propDefinition: [
        app,
        "tagId",
      ],
      description: "Return only chats that have this tag, e.g. `01JABCDEFGHJKMNPQRSTVWXYZ0`. Use **List Tags** to find tag IDs (the `id` field).",
      optional: true,
    },
    contact: {
      type: "string",
      label: "Contact Phone or ID",
      description: "Return only chats of this contact. Accepts a contact ID or part of the phone number as stored in Tinko, e.g. `99999`. Use **Find Contact** to find contact IDs.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const chats = await this.app.getPaginatedResults({
      fn: this.app.listChats,
      args: {
        $,
        params: {
          status: this.status,
          is_open: this.isOpen,
          channel: this.channelId,
          attendant: this.userId,
          tag: this.tagId,
          contact: this.contact,
        },
      },
      max: this.maxResults,
    });

    $.export("$summary", `Found ${chats.length} chat${chats.length === 1
      ? ""
      : "s"}`);
    return chats;
  },
};
