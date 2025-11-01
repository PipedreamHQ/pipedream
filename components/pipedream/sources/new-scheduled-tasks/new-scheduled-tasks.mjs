import pipedream from "../../pipedream.app.mjs";
import sampleEmit from "./test-event.mjs";
import { uuid } from "uuidv4";

export default {
  key: "pipedream-new-scheduled-tasks",
  name: "New Scheduled Tasks",
  type: "source",
  description:
    "Exposes an HTTP API for scheduling messages to be emitted at a future time",
  version: "0.3.2",
  dedupe: "unique", // Dedupe on a UUID generated for every scheduled task
  props: {
    pipedream,
    secret: {
      type: "string",
      secret: true,
      label: "Secret",
      optional: true,
      description:
        "**Optional but recommended**: if you enter a secret here, you must pass this value in the `x-pd-secret` HTTP header when making requests",
    },
    http: {
      label: "Endpoint",
      description: "The endpoint where you'll send task scheduler requests",
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    // To schedule future emits, we emit to the selfChannel of the component
    selfChannel() {
      return "self";
    },
    // Queue for future emits that haven't yet been delivered
    queuedEventsChannel() {
      return "$in";
    },
    httpRespond({
      status, body,
    }) {
      this.http.respond({
        headers: {
          "content-type": "application/json",
        },
        status,
        body,
      });
    },
    async selfSubscribe() {
      // Subscribe the component to itself. We do this here because even in
      // the activate hook, the component isn't available to take subscriptions.
      // Scheduled tasks are sent to the self channel, which emits the message at
      // the specified delivery_ts to this component.
      const isSubscribedToSelf = this.db.get("isSubscribedToSelf");
      if (!isSubscribedToSelf) {
        const componentId = process.env.PD_COMPONENT;
        const selfChannel = this.selfChannel();
        console.log(`Subscribing to ${selfChannel} channel for event source`);
        console.log(
          await this.pipedream.subscribe(componentId, componentId, selfChannel),
        );
        this.db.set("isSubscribedToSelf", true);
      }
    },
    validateEventBody(event, operation) {
      const errors = [];

      // Secrets are optional, so we first check if the user configured
      // a secret, then check its value against the prop (validation below)
      if (this.secret && event.headers["x-pd-secret"] !== this.secret) {
        errors.push(
          "Secret on incoming request doesn't match the configured secret",
        );
      }

      if (operation === "schedule") {
        const {
          timestamp,
          message,
        } = event.body;
        // timestamp should be an ISO 8601 string. Parse and check for validity below.
        const epoch = Date.parse(timestamp);

        if (!timestamp) {
          errors.push(
            "No timestamp included in payload. Please provide an ISO8601 timestamp in the 'timestamp' field",
          );
        }
        if (timestamp && !epoch) {
          errors.push("Timestamp isn't a valid ISO 8601 string");
        }
        if (!message) {
          errors.push("No message passed in payload");
        }
      }

      return errors;
    },
    scheduleTask(event) {
      const errors = this.validateEventBody(event, "schedule");
      let status, body;

      if (errors.length) {
        console.log(errors);
        status = 400;
        body = {
          errors,
        };
      } else {
        const id = this.emitScheduleEvent(event.body, event.body.timestamp);
        status = 200;
        body = {
          msg: "Successfully scheduled task",
          id,
        };
      }

      this.httpRespond({
        status,
        body,
      });
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
    async cancelTask(event) {
      const errors = this.validateEventBody(event, "cancel");
      let status, msg;

      if (errors.length) {
        console.log(errors);
        status = 400;
        msg = "Secret on incoming request doesn't match the configured secret";
      } else {
        try {
          const id = event.body.id;
          const isCanceled = await this.deleteEvent(event);
          if (isCanceled) {
            status = 200;
            msg = `Cancelled scheduled task for event ${id}`;
          } else {
            status = 404;
            msg = `No event with ${id} found`;
          }
        } catch (error) {
          console.log(error);
          status = 500;
          msg = "Failed to schedule task. Please see the logs";
        }
      }

      this.httpRespond({
        status,
        body: {
          msg,
        },
      });
    },
    async deleteEvent(event) {
      const componentId = process.env.PD_COMPONENT;
      const inChannel = this.queuedEventsChannel();

      // The user must pass a scheduled event UUID they'd like to cancel
      // We lookup the event by ID and delete it
      const { id } = event.body;

      // List events in the $in channel - the queue of scheduled events, to be emitted in the future
      const events = await this.pipedream.listEvents(
        componentId,
        inChannel,
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
      await this.pipedream.deleteEvent(
        componentId,
        eventToCancel.id,
        inChannel,
      );
      return true;
    },
    emitEvent(event, summary) {
      // Delete the channel name and id from the incoming event, which were used only as metadata
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
  async run(event) {
    await this.selfSubscribe();

    const { path } = event;
    if (path === "/schedule") {
      this.scheduleTask(event);
    } else if (path === "/cancel") {
      await this.cancelTask(event);
    } else if (event.$channel === this.selfChannel()) {
      this.emitEvent(event);
    }
  },
  sampleEmit,
};
