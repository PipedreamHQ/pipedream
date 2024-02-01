import app from "../../facebook_marketing.app.mjs";

export default {
  key: "facebook_marketing-add-email-to-custom-audience",
  name: "Add Email to Custom Audience",
  description: "Adds an email address to a custom audience segment within Facebook. [See the documentation](https://developers.facebook.com/docs/marketing-api/audiences/overview)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address to add to the custom audience segment.",
    },
    customAudienceId: {
      propDefinition: [
        app,
        "customAudienceId",
        async ({ prevContext }) => {
          const page = prevContext.page
            ? prevContext.page
            : 0;
          const response = await app.listCustomAudiences({
            params: {
              page,
            },
          });
          return {
            options: response.data.map((audience) => ({
              label: audience.name,
              value: audience.id,
            })),
            context: {
              page: page + 1,
            },
          };
        },
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.addEmailToCustomAudience({
      customAudienceId: this.customAudienceId,
      email: this.email,
    });
    $.export("$summary", `Successfully added email to custom audience ${this.customAudienceId}`);
    return response;
  },
};
