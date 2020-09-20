const pipedream = require("https://github.com/PipedreamHQ/pipedream/components/pipedream/pipedream.app.js");
const { uuid } = require("uuidv4");

module.exports = {
  name: "New Scheduled Tasks (Alpha)",
  description:
    "Exposes an HTTP API for scheduling messages to be emitted at a future time",
  version: "0.0.2",
  dedupe: "unique", // Dedupe on a UUID generated for every scheduled task
  props: {
    pipedream,
    secret: {
      type: "string",
      secret: true,
      label: "Secret",
      optional: true,
      description:
        "**Optional but recommended**: if you enter a secret here, you must pass this value in the `secret` parameter HTTP POST requests",
    },
    http: "$.interface.http",
    db: "$.service.db",
  },
  async run(event) {
    const { body, headers, path, $channel, $id } = event;
    const componentId = process.env.PD_COMPONENT;
    const selfChannel = "self";

    // Subscribe the component to itself, if not already.
    // Scheduled tasks are sent to the self channel, which
    // emits the message at the specified delivery_ts to this component.
    const isSubscribedToSelf = this.db.get("isSubscribedToSelf");
    if (!isSubscribedToSelf) {
      console.log(`Subscribing to ${selfChannel} channel for event source`);
      console.log(
        await this.pipedream.subscribe(componentId, componentId, selfChannel)
      );
      this.db.set("isSubscribedToSelf", true);
    }

    // SCHEDULE NEW TASK
    if (path === "/schedule") {
      const { timestamp, message } = body;
      const errors = [];

      // timestamp should be an ISO 8601 string. Parse and check
      // for validity below.
      const epoch = Date.parse(timestamp);

      // Secrets are optional, so we first check if the user configured
      // a secret, then check its value against the prop (validation below)
      if (this.secret && headers["x-pd-secret"] !== this.secret) {
        errors.push(
          "Secret on incoming request doesn't match the configured secret"
        );
      }
      if (!timestamp) {
        errors.push(
          "No timestamp included in payload. Please provide an ISO8601 timestamp in the 'timestamp' field"
        );
      }
      if (timestamp && !epoch) {
        errors.push("Timestamp isn't a valid ISO 8601 string");
      }
      if (!message) {
        errors.push("No message passed in payload");
      }
      if (errors.length) {
        console.log(errors);
        this.http.respond({
          status: 400,
          body: {
            errors,
          },
          headers: {
            "content-type": "application/json",
          },
        });
        return;
      }

      // Scheduled tasks are emitted to the self channel, which is delivered
      // to this same deployed component at the specified delivery_ts
      const $id = uuid();
      this.$emit(
        { ...body, $channel: selfChannel, $id },
        {
          name: selfChannel,
          id: $id,
          delivery_ts: epoch,
        }
      );

      this.http.respond({
        status: 200,
        body: {
          msg: "Successfully scheduled task",
          id: $id,
        },
        headers: {
          "content-type": "application/json",
        },
      });

      return;
    }

    // CANCEL SCHEDULED TASK
    // The user must pass a scheduled event UUID they'd like to cancel
    // We lookup the event by ID and delete it from the 'self' queue
    if (path === "/cancel") {
      const { id } = body;
      const errors = [];

      if (this.secret && headers["x-pd-secret"] !== this.secret) {
        errors.push(
          "Secret on incoming request doesn't match the configured secret"
        );
      }

      let msg, status;
      try {
        // List events in the self channel - the queue of
        // scheduled events, to be emitted in the future
        const events = await this.pipedream.listEvents(
          componentId,
          selfChannel
        );
        console.log(`Events: `, events);

        // Find the event in the list by id
        const eventToCancel = events.data.find((e) => {
          const { metadata } = e;
          return metadata.id === id;
        });

        console.log(`Event to cancel: `, eventToCancel);

        if (!eventToCancel) {
          console.log(`No event with ${id} found`);
          this.http.respond({
            status: 404,
            body: {
              msg: `No event with ${id} found`,
            },
          });
          return;
        }

        // Delete the event in the self channel, where it's queued up for delivery
        console.log(
          await this.pipedream.deleteEvent(
            componentId,
            eventToCancel.id,
            selfChannel
          )
        );
        status = 200;
        msg = `Cancelled scheduled task for event ${id}`;
      } catch (err) {
        status = 500;
        msg = "Failed to schedule task. Please see the logs";
        console.log(err);
      }

      this.http.respond({
        status,
        body: {
          msg,
        },
        headers: {
          "content-type": "application/json",
        },
      });

      return;
    }

    // INCOMING SCHEDULED EMIT
    if ($channel === selfChannel) {
      // Delete the channel name and id from the incoming event,
      // which were used only as metadata
      delete event.$channel;
      delete event.$id;
      this.$emit(event, {
        summary: JSON.stringify(event),
        id: $id,
        ts: +new Date(),
      });
    }
  },
};
