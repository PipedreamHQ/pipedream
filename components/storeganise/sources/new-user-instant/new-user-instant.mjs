import storeganise from "../../storeganise.app.mjs";

export default {
  key: "storeganise-new-user-instant",
  name: "New User Instant",
  description: "Emit new event when a new user is created in Storeganise",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    storeganise,
    userId: {
      propDefinition: [
        storeganise,
        "userId",
      ],
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const { subscription } = await this.storeganise.createUser(this.userId);
      this.db.set("subscriptionId", subscription.id);
    },
    async deactivate() {
      await this.storeganise.deleteUser(this.db.get("subscriptionId"));
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Check if the event is for user creation
    if (body.event !== "user.created") {
      console.log(`Ignoring event ${body.event}`);
      return;
    }

    // Check if the user ID matches the one configured
    if (body.data.id !== this.userId) {
      console.log(`Ignoring user ID ${body.data.id}`);
      return;
    }

    this.$emit(body, {
      id: body.data.id,
      summary: `New user created with ID ${body.data.id}`,
      ts: Date.now(),
    });
  },
};
