import app from "../../getemails.app.mjs";

export default {
  name: "Status Find Email",
  description: "Use this Api when you want to know the status of any previous find-email Api request. [See the documentation](https://app2.getemail.io/dash/integration/api/v2/2).",
  key: "getemails-status-find-email",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    id: {
      type: "string",
      label: "Id",
      description: "Attach the `id` of the record that you want to know status. you can find this `id` in the response when you call **find-email** Api request.",
    },
  },
  async run({ $ }) {
    const res = await this.app.statusFindEmail(this.id, $);
    $.export("summary", `Successfully found the email status of ${this.id}`);
    return res;
  },
};
