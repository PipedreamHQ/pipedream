import app from "../../noticeable.app.mjs";

export default {
  type: "action",
  key: "noticeable-create-email-subscription",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create Email Subscription",
  description: "Creates an email subscription, [See the docs](https://graphdoc.noticeable.io/emailsubscription.doc.html)",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email",
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
    },
  },
  /* eslint-disable multiline-ternary */
  async run ({ $ }) {
    const resp = await this.app.sendQuery({
      $,
      query: `mutation { 
        createEmailSubscription(
          input: {
            projectId: "${this.projectId}",
            email: "${this.email}",
            ${this.fullName ? "fullName: \"" + this.fullName + "\"," : ""}
            status: ${this.status},
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
    $.export("$summary", `Email subscription has been created for ${resp?.data?.createEmailSubscription?.emailSubscription?.email}`);
    return resp;
  },
};
