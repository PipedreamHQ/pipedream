import moment from "moment";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "vbout-create-social-media-message",
  name: "Create Social Media Message",
  description: "This action creates a new post on social media. [See the docs here](https://developers.vbout.com/docs#socialmedia_addpost)",
  version: "0.0.2",
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
          channel: channel && (channel.label.split(" - "))[0],
          channelid: channel && channel.value,
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
