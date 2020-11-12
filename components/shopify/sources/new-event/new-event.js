const shopify = require("../../shopify.app.js");

module.exports = {
	key: "shopify-new-event",
	name: "New Events",
	description: "Emits an event for each new Shopify event.",
	version: "0.0.1",
	props: {
		db: "$.service.db",
		timer: {
			type: "$.interface.timer",
			default: {
				intervalSeconds: 60 * 15,
			},
		},
		shopify,
		eventTypes: { propDefinition: [shopify, "eventTypes"] },
	},
	methods: {
		emitEvents(results, eventType) {
			for (const event of results) {
				this.$emit(event, {
					id: event.id,
					summary: event.message,
					ts: Date.now(),
				});
				if (results[results.length - 1])
					this.db.set(eventType, results[results.length - 1].id);
			}
		},
	},
	async run() {
		let since_id = this.db.get("since_id") || null;
		if (this.eventTypes.length === 0) {
			// if no event type is specified
			let results = await this.shopify.getEvents(since_id);
			this.emitEvents(results, "since_id");
		} else {
			for (const eventType of this.eventTypes) {
				since_id = this.db.get(eventType) || since_id;
				let results = await this.shopify.getEvents(
					since_id,
					JSON.parse(eventType).filter,
					JSON.parse(eventType).verb
				);
				this.emitEvents(results, eventType);
			}
		}
	},
};