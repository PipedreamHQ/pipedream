import app from "../../noticeable.app.mjs";

export default {
  type: "action",
  key: "noticeable-update-email-subscription",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Update Email Subscription",
  description: "Updates an email subscription, [See the docs](https://graphdoc.noticeable.io/emailsubscription.doc.html)",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    emailSubscriptionId: {
      propDefinition: [
        app,
        "emailSubscriptionId",
        (configuredProps) => ({
          projectId: configuredProps.projectId,
        }),
      ],
    },
    fullName: {
      propDefinition: [
        app,
        "fullName",
      ],
    },
    status: {
      propDefinition: [
        app,
        "status",
      ],
      optional: true,
    },
  },
  /* eslint-disable multiline-ternary */
  async run ({ $ }) {
    const resp = await this.app.sendQuery({
      $,
      query: `mutation {
        updateEmailSubscription(
          input: {
            projectId: "${this.projectId}",
            email: "${this.emailSubscriptionId}",
            ${this.fullName ? "fullName: \"" + this.fullName + "\"," : ""}
            ${this.status ? "status: " + this.status + "," : ""}
          }
        ) {
          emailSubscription {
            email
          }
        }
      }`,
    });
    if (resp.errors) {
      console.log(resp);
      throw new Error(resp.errors[0]?.message);
    }
    $.export("$summary", `Email subscription has been updated for ${resp?.data?.updateEmailSubscription?.emailSubscription?.email}`);
    return resp;
  },
};
