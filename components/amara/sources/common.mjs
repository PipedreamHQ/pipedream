import amara from "../amara.app.mjs";
import constants from "../constants.mjs";

export default {
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    team: {
      optional: true,
      propDefinition: [
        amara,
        "team",
      ],
    },
  },
  methods: {
    setLastUrl(lastUrl) {
      this.db.set(constants.LAST_URL, lastUrl);
    },
    getLastUrl() {
      return this.db.get(constants.LAST_URL);
    },
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
    async emitEvents({
      $, team, allowedEvents = [],
    }) {
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
            team,
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
  },
};
