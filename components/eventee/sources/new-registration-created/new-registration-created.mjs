import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "eventee-new-registration-created",
  name: "New Registration Created",
  description: "Emit new event when a new registration is created. [See the documentation](https://publiceventeeapi.docs.apiary.io/#reference/registrations/get-all-registrations/get-all)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(registration) {
      return {
        id: registration.id,
        summary: `New Registration with ID: ${registration.id}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const registrations = await this.eventee.listRegistrations();
    for (const registration of registrations) {
      const meta = this.generateMeta(registration);
      this.$emit(registration, meta);
    }
  },
};
