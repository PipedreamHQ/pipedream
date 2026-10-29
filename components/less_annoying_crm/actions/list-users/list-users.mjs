import app from "../../less_annoying_crm.app.mjs";

export default {
  key: "less_annoying_crm-list-users",
  name: "List Users",
  description: "Returns the current user (the owner of the API key) and all users in the Less Annoying CRM account, with their user IDs and timezones."
    + " Use this first when the user says \"my\" or \"me\" (e.g. \"my contacts\", \"assign to me\") to get their user ID, or to resolve a teammate's name to a user ID for the `assignedTo` parameter of **Create Contact**, **Update Contact**, and **Create Task**."
    + " Takes no inputs. Example result: `{\"currentUser\": {\"UserId\": 101, \"FirstName\": \"Alex\", \"LastName\": \"Doe\", \"Email\": \"alex@acme.com\", \"Timezone\": \"America/Chicago\"}, \"users\": [{\"UserId\": 101, \"FirstName\": \"Alex\", \"LastName\": \"Doe\"}, {\"UserId\": 102, \"FirstName\": \"Sam\", \"LastName\": \"Lee\"}]}`."
    + " [See the documentation](https://account.lessannoyingcrm.com/api_docs/v2/Settings_Functions/Users#Goto-GetUsers)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const [
      currentUser,
      users,
    ] = await Promise.all([
      this.app.getUser({
        $,
      }),
      this.app.getUsers({
        $,
      }),
    ]);

    $.export("$summary", `Found ${users.length} user(s); current user is ${currentUser.FirstName} ${currentUser.LastName}`);
    return {
      currentUser,
      users,
    };
  },
};
