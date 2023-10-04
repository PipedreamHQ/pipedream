import app from "../linkedin/linkedin.app.mjs";

export default {
  ...app,
  type: "app",
  app: "linkedin_ads",
  propDefinitions: {
    ...app.propDefinitions,
    adAccountId: {
      type: "string",
      label: "Ad Account Id",
      description: "Sponsored ad account id to match results by",
      async options({
        page, mapper = ({
          id: value, name: label,
        }) => ({
          value,
          label,
        }),
      }) {
        const limit = 10;
        const { elements } = await this.searchAdAccounts({
          params: {
            count: 10,
            start: limit * page,
          },
        });
        return elements?.map(mapper);
      },
    },
  },
};
