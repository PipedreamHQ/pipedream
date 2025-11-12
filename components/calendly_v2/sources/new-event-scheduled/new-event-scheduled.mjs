import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../calendly_v2.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "calendly_v2-new-event-scheduled",
  name: "New Event Scheduled",
  description: "Emit new event when a event is scheduled.",
  version: "0.0.9",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    alert: {
      propDefinition: [
        app,
        "listEventsAlert",
      ],
    },
    scope: {
      propDefinition: [
        app,
        "listEventsScope",
      ],
      reloadProps: true,
    },
    organization: {
      propDefinition: [
        app,
        "organization",
      ],
      optional: true,
      hidden: true,
    },
    user: {
      propDefinition: [
        app,
        "user",
        (c) => ({
          organization: c.organization,
        }),
      ],
      description: "Returns events for a specified user",
      optional: true,
      hidden: true,
    },
    group: {
      propDefinition: [
        app,
        "groupId",
        (c) => ({
          organization: c.organization,
        }),
      ],
      description: "Returns events for a specified group",
      optional: true,
      hidden: true,
    },
  },
  async additionalProps(props) {
    return this.app.listEventsAdditionalProps(props, this.scope);
  },
  methods: {
    emitEvent(data) {
      const id = data.uri.split("/").reverse()[0];

      this.$emit(data, {
        id: id,
        summary: `New scheduled event with ID ${id}`,
        ts: Date.parse(data.created_at),
      });
    },
    _setLastResourceId(id) {
      this.db.set("lastResourceId", id);
    },
    _getLastResourceId() {
      return this.db.get("lastResourceId");
    },
  },
  async run() {
    const lastResourceId = this._getLastResourceId();

    let nextPage;

    const params = {
      count: 100,
      sort: "created_at:desc",
    };
    if (this.scope !== "authenticatedUser") {
      params.organization = this.organization;
    }
    if (this.scope === "user") {
      params.user = this.user;
    }
    if (this.scope === "group") {
      params.group = this.group;
    }

    do {
      const {
        pagination, collection: events,
      } = await this.app.listEvents({
        params: {
          ...params,
          page_token: nextPage,
        },
      });

      if (events.length) {
        this._setLastResourceId(events[events.length - 1].uri);

        events.forEach(this.emitEvent);
      }

      if (
        events.length < 100 ||
        events.find(({ uri }) => uri === lastResourceId)
      ) {
        nextPage = null;
        return;
      }

      nextPage = pagination.next_page;
    } while (nextPage);
  },
  sampleEmit,
};
