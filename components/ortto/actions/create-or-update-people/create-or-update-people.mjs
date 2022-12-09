import app from "../../ortto.app.mjs";

export default {
  key: "ortto-create-or-update-people",
  name: "Create or Update people",
  description: "Creates or updates one or more person records in Ortto’s customer data platform (CDP). [See the docs](https://help.ortto.com/developer/latest/api-reference/person/merge.html).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
