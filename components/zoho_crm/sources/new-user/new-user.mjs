import common from "../common/timer-based/base.mjs";
import userTypes from "../common/user-types.mjs";

export default {
  ...common,
  key: "zoho_crm-new-user",
  name: "New User",
  description: "Emits an event each time a new user is created in Zoho CRM",
  version: "0.0.8",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    userType: {
      type: "string",
      label: "User Type",
      description: "The type of users to generate events for",
      options: userTypes,
    },
  },
  hooks: {
    async activate() {
      const userCount = await this.zohoCrm.getUserCount({
        type: this.userType,
      });
      this._setUserCount(userCount);
    },
  },
  methods: {
    ...common.methods,
    _getUserCount() {
      return this.db.get("userCount");
    },
    _setUserCount(userCount) {
      this.db.set("userCount", userCount);
    },
    generateMeta({
      user,
      event,
    }) {
      const {
        id,
        first_name: firstName = "",
        last_name: lastName = "",
      } = user;
      const lastNameInitial = lastName
        ? `${lastName.slice(0, 1)}.`
        : "";
      const userNameDisplay = `${firstName} ${lastNameInitial}`;
      const summary = `New User: ${userNameDisplay}`;
      const { timestamp: ts } = event;
      return {
        id,
        summary,
        ts,
      };
    },
    async processEvent(event) {
      const lastUserCount = this._getUserCount();
      const usersPage = this.zohoCrm.computeLastUsersPage({
        userCount: lastUserCount,
      });
      let usersOffset = this.zohoCrm.computeUsersOffset({
        userCount: lastUserCount,
      });
      let newUserCount = lastUserCount;
      const userScan = await this.zohoCrm.getUsers({
        page: usersPage,
        type: this.userType,
      });
      for await (const user of userScan) {
        if (usersOffset > 0) {
          // The first items in the user retrieval could have been already
          // processed. `usersOffset` contains the amount of items that we need to
          // skip before we hit a new, unprocessed item.
          --usersOffset;
          continue;
        }

        const meta = this.generateMeta({
          user,
          event,
        });
        this.$emit(user, meta);
        ++newUserCount;
      }

      this._setUserCount(newUserCount);
    },
  },
};
