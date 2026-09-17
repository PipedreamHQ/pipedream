import harvest from "../../harvest.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "harvest-list-users",
  name: "List Users",
  description: `List users in the Harvest account, automatically following pagination up to ${constants.MAX_AUTO_PAGINATE_RECORDS} users. Use this to discover user IDs for **Create User Assignment**, **Create Timesheet Entry**, and other tools that accept a User ID. Example: call with isActive=true to find Alan Grant's user ID before logging time on his behalf. [See the documentation](https://help.getharvest.com/api-v2/users-api/users/users/#list-all-users).`,
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    harvest,
    accountId: {
      propDefinition: [
        harvest,
        "accountId",
      ],
    },
    isActive: {
      propDefinition: [
        harvest,
        "isActive",
      ],
      description: "Only return active or inactive users.",
    },
    updatedSince: {
      propDefinition: [
        harvest,
        "updatedSince",
      ],
    },
  },
  async run({ $ }) {
    const users = [];
    const pages = this.harvest.listUsersPaginated({
      page: 1,
      accountId: this.accountId,
      isActive: this.isActive,
      updatedSince: this.updatedSince,
    });
    for await (const user of pages) {
      users.push(user);
      if (users.length >= constants.MAX_AUTO_PAGINATE_RECORDS) break;
    }
    const count = users.length;
    $.export("$summary", `Successfully retrieved ${count} user${count === 1
      ? ""
      : "s"}`);
    return users;
  },
};
