import app from "../../testrail.app.mjs";

export default {
  key: "testrail-get-current-user",
  name: "Get Current User",
  description: "Get the TestRail user the connected account is logged in as. Use it when the user says \"me\" or \"my\" (for example to assign a run or result to themselves) or asks who they are in TestRail. To look up other projects or data, use **List Projects** instead. Returns the user's id, name, email, role, whether they are an admin and the ids of their groups. Example: no inputs → {id: 1, name: \"Dylan Sather\", email: \"dylan@example.com\", role: \"Lead\", is_admin: true}. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    const user = await this.app.getCurrentUser($);
    $.export("$summary", `Logged in as ${user.name} (${user.email})`);
    return user;
  },
};
