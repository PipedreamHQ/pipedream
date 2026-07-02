import moment from "moment";
import common from "../common/base.mjs";
import { parseChannelOptions } from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...common,
  key: "vbout-create-social-media-message",
  name: "Create Social Media Message",
  description: "This action creates a new post on social media. [See the documentation](https://developers.vbout.com/docs/?r=developers/docs#tag/Social-Media/operation/post-SocialMedia-AddPost)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    message: {
      propDefinition: [
        common.props.vbout,
        "message",
      ],
    },
    channel: {
      propDefinition: [
        common.props.vbout,
        "channel",
      ],
    },
    photo: {
      propDefinition: [
        common.props.vbout,
        "photo",
      ],
      optional: true,
    },
    isScheduled: {
      propDefinition: [
        common.props.vbout,
        "isScheduled",
      ],
      optional: true,
      description: "This flag will make the post to be scheduled for future.",
    },
    scheduledDatetime: {
      propDefinition: [
        common.props.vbout,
        "scheduledDatetime",
      ],
      optional: true,
    },
    trackableLinks: {
      propDefinition: [
        common.props.vbout,
        "trackableLinks",
      ],
      optional: true,
    },
  },
  methods: {
    async getChannelName(channel) {
      let label = channel?.label;
      if (!label) {
        const channels = await this.getChannels();
        const options = parseChannelOptions(channels);
        const channelOption = options.find((option) => option.value === channel);
        if (!channelOption) {
          throw new ConfigurationError(`Channel "${channel}" not found.`);
        }
        label = channelOption?.label;
      }
      return label.split(" - ")[0];
    },
    async processEvent($) {
      const {
        message,
        channel,
        photo,
        isScheduled,
        scheduledDatetime,
        trackableLinks,
      } = this;
      const dateTime = moment(scheduledDatetime);

      return this.vbout.createPost({
        $,
        params: {
          message,
          channel: await this.getChannelName(channel),
          channelid: channel?.value || channel,
          photo,
          isscheduled: isScheduled,
          scheduleddate: dateTime && dateTime.format("YYYY-MM-DD"),
          scheduledhours: dateTime && dateTime.format("hh:mm"),
          scheduledampm: dateTime && dateTime.format("A"),
          trackableLinks,
        },
      });
    },
    getSummary() {
      return `Marketing Campaign "${this.name}" Successfully created!`;
    },
  },
};
