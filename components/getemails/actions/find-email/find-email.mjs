import app from "../../getemails.app.mjs";

export default {
  name: "Find Email",
  description: "Provide Full name of your prospect with Domain or Website and Api will provide you an email address of the prospect in response.  [See the documentation](https://app2.getemail.io/dash/integration/api/v2/1#).",
  key: "getemails-find-email",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    fullname: {
      type: "string",
      label: "Full Name",
      description: "Full name of your prospect",
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "Domain or Company name of prospect. eg- `Microsoft.com` or `Microsoft`",
    },
    isEnrichToDo: {
      type: "boolean",
      label: "Enrich To Do",
      description: "Pass `isEnrichToDo` flag as `true` when you want to find additional information about prospect. **NOTE-** Passing `isEnrichToDo` flag as `true` will take some more time than usual.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      ...data
    } = this;

    const res = await app.findEmail(data, $);
    $.export("summary", "Successfully found email address of the prospect");
    return res;
  },
};
