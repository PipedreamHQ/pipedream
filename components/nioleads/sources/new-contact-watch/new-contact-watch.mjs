import nioleads from "../../nioleads.app.mjs";

export default {
  type: "source",
  key: "nioleads-new-contact-watch",
  name: "New Contact Watch",
  description: "Emit new event when a new contact is watched.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    nioleads,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    email: {
      propDefinition: [
        nioleads,
        "email",
      ],
    },
    firstName: {
      propDefinition: [
        nioleads,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        nioleads,
        "lastName",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const email = this.email;
      const firstName = this.firstName;
      const lastName = this.lastName;
      await this.nioleads.emitNewWatchedContact(email, firstName, lastName);
    },
  },
  async run() {
    const lastRunTime = this.db.get("lastRunTime") || this.timer.timestamp;
    const currentTime = +new Date();
    const email = await this.nioleads.verifyEmail(this.email);
    if (email && email.verified) {
      const contactData = {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
      };
      this.$emit(contactData, {
        id: this.email,
        summary: `New contact is watched for ${this.email}`,
        ts: currentTime,
      });
    }
    this.db.set("lastRunTime", currentTime);
  },
};
