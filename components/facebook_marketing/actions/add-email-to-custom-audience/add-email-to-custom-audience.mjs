import facebookMarketingApi from "../../facebook_marketing_api.app.mjs";

export default {
  key: "facebook_marketing-add-email-to-custom-audience",
  name: "Add Email to Custom Audience",
  description: "Adds an email address to a custom audience segment within Facebook. [See the documentation](https://developers.facebook.com/docs/marketing-api/audiences/overview)",
  version: "0.0.1",
  type: "action",
  props: {
    facebookMarketingApi,
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address to add to the custom audience segment.",
    },
    customAudienceId: {
      propDefinition: [
        facebookMarketingApi,
        "customAudienceId",
        async ({ prevContext }) => {
          const page = prevContext.page
            ? prevContext.page
            : 0;
          const response = await facebookMarketingApi.listCustomAudiences({
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
    const response = await this.facebookMarketingApi.addEmailToCustomAudience({
      customAudienceId: this.customAudienceId,
      email: this.email,
    });
    $.export("$summary", `Successfully added email to custom audience ${this.customAudienceId}`);
    return response;
  },
};
