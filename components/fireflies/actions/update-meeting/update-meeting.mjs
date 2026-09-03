import fireflies from "../../fireflies.app.mjs";
import mutations from "../../common/mutations.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "fireflies-update-meeting",
  name: "Update Meeting",
  description: "Update a meeting's title, privacy level, and/or channel. Each selected field is applied through a separate, sequential mutation rather than a single atomic call — if a later update fails, earlier successful changes remain applied. Set only the fields you want to change — unset fields are left untouched. Updating the title requires admin privileges on the Fireflies team. See the documentation for [Update Meeting Title](https://docs.fireflies.ai/graphql-api/mutation/update-meeting-title), [Update Meeting Privacy](https://docs.fireflies.ai/graphql-api/mutation/update-meeting-privacy) and [Update Meeting Channel](https://docs.fireflies.ai/graphql-api/mutation/update-meeting-channel)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    fireflies,
    meetingId: {
      propDefinition: [
        fireflies,
        "meetingId",
      ],
      description: "The meeting to update. Use **Find Meeting by ID** or **Find Recent Meeting** to look up a meeting ID.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The new title for the meeting, e.g. `Q3 Budget Review`. Must be between 5 and 256 characters and should not contain special characters.",
      optional: true,
    },
    privacy: {
      type: "string",
      label: "Privacy",
      description: "Who can access the meeting. `link` - anyone with the link, `owner` - only the meeting owner, `participants` - meeting participants only, `teammates` - the owner's teammates, `teammatesandparticipants` - teammates and participants.",
      optional: true,
      options: [
        {
          label: "Anyone with the link",
          value: "link",
        },
        {
          label: "Owner only",
          value: "owner",
        },
        {
          label: "Participants only",
          value: "participants",
        },
        {
          label: "Teammates only",
          value: "teammates",
        },
        {
          label: "Teammates and participants",
          value: "teammatesandparticipants",
        },
      ],
    },
    channelId: {
      propDefinition: [
        fireflies,
        "channelId",
      ],
      description: "Move the meeting into this channel. Use **List Channel ID Options** to browse available channels.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.title && !this.privacy && !this.channelId) {
      throw new ConfigurationError("Set at least one of Title, Privacy, or Channel ID to update.");
    }
    if (this.title
      && (this.title.length < constants.MIN_MEETING_TITLE_LENGTH
        || this.title.length > constants.MAX_MEETING_TITLE_LENGTH)) {
      throw new ConfigurationError(`Title must be between ${constants.MIN_MEETING_TITLE_LENGTH} and ${constants.MAX_MEETING_TITLE_LENGTH} characters.`);
    }

    const changed = [];
    const result = {};

    if (this.title) {
      const { data: { updateMeetingTitle } } = await this.fireflies.query({
        $,
        data: {
          query: mutations.updateMeetingTitle,
          variables: {
            input: {
              id: this.meetingId,
              title: this.title,
            },
          },
        },
      });
      result.title = updateMeetingTitle;
      changed.push(`title set to "${this.title}"`);
    }

    if (this.privacy) {
      const { data: { updateMeetingPrivacy } } = await this.fireflies.query({
        $,
        data: {
          query: mutations.updateMeetingPrivacy,
          variables: {
            input: {
              id: this.meetingId,
              privacy: this.privacy,
            },
          },
        },
      });
      result.privacy = updateMeetingPrivacy;
      changed.push(`privacy set to "${this.privacy}"`);
    }

    if (this.channelId) {
      const { data: { updateMeetingChannel } } = await this.fireflies.query({
        $,
        data: {
          query: mutations.updateMeetingChannel,
          variables: {
            input: {
              transcript_ids: [
                this.meetingId,
              ],
              channel_id: this.channelId,
            },
          },
        },
      });
      result.channel = updateMeetingChannel;
      changed.push("channel updated");
    }

    $.export("$summary", `Updated meeting ${this.meetingId} — ${changed.join(", ")}`);
    return result;
  },
};
