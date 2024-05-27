import { axios } from "@pipedream/platform";
import ispringLearn from "../../ispring_learn.app.mjs";

export default {
  key: "ispring_learn-new-registration-instant",
  name: "New User Registration (Instant)",
  description: "Emits an event when a new user is registered. [See the documentation]()",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ispringLearn,
    db: "$.service.db",
    userRegistrationData: {
      propDefinition: [
        ispringLearn,
        "userRegistrationData",
      ],
    },
    userProfileData: {
      propDefinition: [
        ispringLearn,
        "userProfileData",
      ],
      optional: true,
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      // Placeholder for the deploy hook.
    },
    async activate() {
      // Placeholder for the activate hook.
    },
    async deactivate() {
      // Placeholder for the deactivate hook.
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, createdAt,
      } = data;
      return {
        id,
        summary: `New User Registered: ${id}`,
        ts: Date.parse(createdAt),
      };
    },
  },
  async run() {
    const userData = {
      userRegistrationData: this.userRegistrationData,
      userProfileData: this.userProfileData,
    };

    try {
      const response = await this.ispringLearn.registerUser(userData);
      const { data } = response;
      if (data) {
        const meta = this.generateMeta(data);
        this.$emit(data, meta);
      }
    } catch (error) {
      throw new Error(`Error registering user: ${error.message}`);
    }
  },
};
