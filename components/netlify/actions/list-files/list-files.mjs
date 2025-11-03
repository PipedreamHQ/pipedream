import netlify from "../../netlify.app.mjs";

export default {
  key: "netlify-list-files",
  name: "List Files",
  description: "Returns a list of all the files in the current deploy. [See docs](https://docs.netlify.com/api/get-started/#get-files)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    netlify,
    siteId: {
      propDefinition: [
        netlify,
        "siteId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.netlify.listFiles(this.siteId);
    $.export("$summary", "Got files for site");
    return response;
  },
};
