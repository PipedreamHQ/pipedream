import { axios } from "@pipedream/platform";
import { v4 as uuid } from "uuid";

export default {
  methods: {
    async _makeAPIRequest({
      $ = this, apiKey, ...opts
    }) {
      if (!opts.headers) opts.headers = {};
      opts.headers["Authorization"] = `Bearer ${apiKey}`;
      opts.headers["Content-Type"] = "application/json";
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      const { path } = opts;
      delete opts.path;
      opts.url = `https://api.pipedream.com/v1${path[0] === "/"
        ? ""
        : "/"
      }${path}`;
      return axios($, opts);
    },
    selfChannel() {
      return "self";
    },
    queuedEventsChannel() {
      return "$in";
    },
    async subscribe(emitter_id, listener_id, event_name = null, apiKey) {
      let params = {
        emitter_id,
        listener_id,
      };
      if (event_name) {
        params.event_name = event_name;
      }
      return await this._makeAPIRequest({
        method: "POST",
        path: "/subscriptions",
        params,
        apiKey,
      });
    },
    async selfSubscribe(apiKey) {
      const isSubscribedToSelf = this.db.get("isSubscribedToSelf");
      if (!isSubscribedToSelf) {
        const componentId = process.env.PD_COMPONENT;
        const selfChannel = this.selfChannel();
        console.log(`Subscribing to ${selfChannel} channel for event source`);
        console.log(
          await this.subscribe(componentId, componentId, selfChannel, apiKey),
        );
        this.db.set("isSubscribedToSelf", true);
      }
    },
    emitScheduleEvent(event, timestamp) {
      const selfChannel = this.selfChannel();
      const epoch = Date.parse(timestamp);
      const $id = uuid();

      console.log(`Scheduled event to emit on: ${new Date(epoch)}`);

      this.$emit(
        {
          ...event,
          $channel: selfChannel,
          $id,
        },
        {
          name: selfChannel,
          id: $id,
          delivery_ts: epoch,
        },
      );

      return $id;
    },
    async deleteScheduledEvent(event, apiKey) {
      const componentId = process.env.PD_COMPONENT;
      const inChannel = this.queuedEventsChannel();

      // The user must pass a scheduled event UUID they'd like to cancel
      // We lookup the event by ID and delete it
      const { id } = event.body;

      // List events in the $in channel - the queue of scheduled events, to be emitted in the future
      const events = await this.listEvents(
        componentId,
        inChannel,
        apiKey,
      );
      console.log("Events: ", events);

      // Find the event in the list by id
      const eventToCancel = events.data.find((e) => {
        const { metadata } = e;
        return metadata.id === id;
      });

      console.log("Event to cancel: ", eventToCancel);

      if (!eventToCancel) {
        console.log(`No event with ${id} found`);
        return false;
      }

      // Delete the event
      await this.deleteEvent(
        componentId,
        eventToCancel.id,
        inChannel,
        apiKey,
      );
      return true;
    },
    async listEvents(dcID, event_name, apiKey) {
      return await this._makeAPIRequest({
        path: `/sources/${dcID}/event_summaries`,
        params: {
          event_name,
        },
        apiKey,
      });
    },
    async deleteEvent(dcID, eventID, event_name, apiKey) {
      return await this._makeAPIRequest({
        method: "DELETE",
        path: `/sources/${dcID}/events`,
        params: {
          start_id: eventID,
          end_id: eventID,
          event_name,
        },
        apiKey,
      });
    },
    emitEvent(event, summary) {
      const id = event.$id;
      delete event.$channel;
      delete event.$id;

      this.$emit(event, {
        summary: summary ?? JSON.stringify(event),
        id,
        ts: +new Date(),
      });
    },
  },
};
