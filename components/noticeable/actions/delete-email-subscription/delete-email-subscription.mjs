import app from "../../noticeable.app.mjs";

export default {
  type: "action",
  key: "noticeable-delete-email-subscription",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Delete Email Subscription",
  description: "Deletes an email subscription, [See the docs](https://graphdoc.noticeable.io/emailsubscription.doc.html)",
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
  },
  async run ({ $ }) {
    const resp = await this.app.sendQuery({
      $,
      query: `mutation {
        deleteEmailSubscription(
          input: {
            projectId: "${this.projectId}",
            email: "${this.emailSubscriptionId}",
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
    $.export("$summary", `Email subscription has been deleted for ${resp?.data?.deleteEmailSubscription?.emailSubscription?.email}`);
    return resp;
  },
};
