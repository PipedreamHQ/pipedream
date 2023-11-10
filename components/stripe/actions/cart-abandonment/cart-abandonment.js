const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-cart-abandonment",
  name: "Cart Abandonment",
  type: "action",
  description: "Emits an event when a customer abandons their cart.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    stripe,
    events: {
      propDefinition: [stripe, "events"],
      optional: false,
      description:
        "A comma-separated list of [events](https://stripe.com/docs/api/events/types)." +
        " Leave empty to receive all events.",
    },
    limit: {
      propDefinition: [stripe, "limit"],
      optional: true,
      description:
        "A limit on the number of objects to be returned. Limit can range between 1 and" +
        " 100 items.",
    },
    starting_after: {
      propDefinition: [stripe, "starting_after"],
      optional: true,
      description:
        "A cursor for use in pagination. `starting_after` is an object ID that defines" +
        " your place in the list. For instance, if you make a list request and receive 100" +
        " objects, starting with `obj_bar`, your subsequent call can include `starting_after=obj_bar`" +
        " in order to fetch the next page of the list.",
    },
    ending_before: {
      propDefinition: [stripe, "ending_before"],
      optional: true,
      description:
        "A cursor for use in pagination. `ending_before` is an object ID that defines" +
        " your place in the list. For instance, if you make a list request and receive 100" +
        " objects, ending with `obj_foo`, your subsequent call can include `ending_before=obj_foo`" +
        " in order to fetch the previous page of the list.",
    },
  },
  async run({ $ }) {
    const events = this.events ? this.events.split(",") : null;
    const limit = this.limit ? parseInt(this.limit, 10) : 100;
    const starting_after = this.starting_after;
    const ending_before = this.ending_before;

    const params = {
      limit,
      starting_after,
      ending_before,
    };
    if (events) {
      params.type = events;
    }

    const results = await this.stripe.sdk().events.list(params);
    const data = results.data.filter(
      (event) => event.type === "payment_intent.created"
    );

    const eventsToEmit = data.map((event) => {
      const { id, created } = event;
      const paymentIntent = event.data.object;
      return {
        id,
        created,
        paymentIntent,
      };
    });

    $.emit(eventsToEmit);
  },
};
