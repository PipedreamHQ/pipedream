import knorish from "../../knorish.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "knorish-new-signup-instant",
  name: "New Signup Instant",
  description: "Emit new event when a new signup or registration happens on your site. [See the documentation](https://knowledge.knorish.com/api-endpoints-and-postman-dump-publisher-api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    knorish,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      // Fetch the most recent signups during the first run
      const signups = await this.knorish.getUsers({
        per_page: 50,
      });
      signups.slice(-50).forEach((signup) => {
        this.$emit(signup, {
          id: signup.id,
          summary: `New Signup: ${signup.name}`,
          ts: Date.parse(signup.created_at),
        });
      });
    },
  },
  methods: {
    _getLastSignupDate() {
      return this.db.get("last_signup_date") || new Date().toISOString();
    },
    _setLastSignupDate(date) {
      this.db.set("last_signup_date", date);
    },
  },
  async run() {
    // Check for new signups since the last time the source ran
    const lastSignupDate = this._getLastSignupDate();
    const newSignups = await this.knorish.getUsers({
      since: lastSignupDate,
    });

    newSignups.forEach((signup) => {
      this.$emit(signup, {
        id: signup.id,
        summary: `New Signup: ${signup.name}`,
        ts: Date.parse(signup.created_at),
      });
    });

    // Update the last signup date
    if (newSignups.length > 0) {
      const mostRecentSignupDate = newSignups[newSignups.length - 1].created_at;
      this._setLastSignupDate(mostRecentSignupDate);
    }
  },
};
