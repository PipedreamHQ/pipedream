import netlify from "../../netlify.app.mjs";

export default {
  key: "netlify-rollback-deploy",
  name: "Rollback Deploy",
  description: "Restores an old deploy and makes it the live version of the site. [See docs](https://docs.netlify.com/api/get-started/#restore-deploy-rollback)",
  version: "0.0.1",
  type: "action",
  props: {
    netlify,
    siteId: {
      propDefinition: [
        netlify,
        "siteId",
      ],
    },
    deployId: {
      propDefinition: [
        netlify,
        "deployId",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = this.netlify.rollbackDeploy(this.siteId, this.deployId);
    $.export("$summary", "Rolling back deploy");
    return response;
  },
};
