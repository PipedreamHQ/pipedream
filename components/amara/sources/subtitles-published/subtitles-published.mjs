import constants from "../../constants.mjs";
import common from "../common.mjs";

const allowedEvents = [
  constants.EVENT_TYPES.SUBTITLES_PUBLISHED,
];

export default {
  ...common,
  key: "amara-subtitles-published",
  name: "Subtitles published",
  description: "Emit new event subtitles published. [See the docs here](https://apidocs.amara.org/#video-notifications)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    team: {
      ...common.props.team,
      optional: false,
    },
  },
  methods: {
    ...common.methods,
    getMetadata(notification) {
      const {
        number: id,
        event,
      } = notification.data;
      const summary = `${id} ${event}`;
      return {
        id: JSON.stringify(notification),
        summary,
        ts: Date.now(),
      };
    },
  },
  async run({ $ }) {
    let lastUrl = this.getLastUrl();
    let nextUrl;

    do {
      const {
        meta,
        objects: notifications,
      } =
        await this.amara.getTeamNotifications({
          $,
          url: lastUrl,
          team: this.team,
          limit: 20,
        });

      nextUrl = meta.next;
      if (nextUrl) {
        lastUrl = nextUrl;
      }

      notifications
        .filter(({ data }) => allowedEvents.includes(data.event))
        .forEach((notification) => {
          this.$emit(notification, this.getMetadata(notification));
        });

    } while (nextUrl);

    this.setLastUrl(lastUrl);
  },
};
