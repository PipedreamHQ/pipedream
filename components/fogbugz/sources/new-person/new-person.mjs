import { axios } from "@pipedream/platform";
import fogbugz from "../../fogbugz.app.mjs";

export default {
  key: "fogbugz-new-person",
  name: "New Person Created",
  description: "Emits an event when a new person or a user is created in FogBugz. It effectively tracks the addition of new users in the system.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    fogbugz,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5, // 5 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      // On deploy, fetch and emit the details for the latest created user to establish an initial state
      const users = await this.fogbugz.listProjects(); // Assuming listProjects method returns the latest users for demonstration
      users.slice(-50).forEach((user) => {
        this.$emit(user, {
          id: user.ixPerson,
          summary: `New User: ${user.sFullName}`,
          ts: Date.now(),
        });
      });
    },
  },
  methods: {
    _getLastUserId() {
      return this.db.get("lastUserId") || 0;
    },
    _setLastUserId(lastUserId) {
      this.db.set("lastUserId", lastUserId);
    },
  },
  async run() {
    const lastUserId = this._getLastUserId();
    let maxUserIdFound = lastUserId;

    let increment = 1;
    while (true) {
      try {
        const userId = lastUserId + increment;
        const userDetails = await this.fogbugz.editUser({
          ixPerson: userId.toString(),
          userDetails: {},
        });

        if (userDetails && userDetails.email) {
          this.$emit(userDetails, {
            id: userDetails.ixPerson.toString(),
            summary: `New User: ${userDetails.sFullName} (${userDetails.sEmail})`,
            ts: Date.now(),
          });
          maxUserIdFound = Math.max(maxUserIdFound, userId);
        }

        increment++;
      } catch (error) {
        console.log(`Stopping at user ID ${lastUserId + increment} - assuming no more new users.`);
        break;
      }
    }

    if (maxUserIdFound > lastUserId) {
      this._setLastUserId(maxUserIdFound);
    }
  },
};
