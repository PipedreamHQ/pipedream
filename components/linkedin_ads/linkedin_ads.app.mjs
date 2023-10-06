import app from "../linkedin/linkedin.app.mjs";

export default {
  ...app,
  type: "app",
  app: "linkedin_ads",
  methods: {
    ...app.methods,
    getSponsoredAccountUrn(id) {
      return `urn:li:sponsoredAccount:${id}`;
    },
  },
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
    accounts: {
      type: "string[]",
      label: "Accounts",
      description: "An [Array of Account URN](https://docs.microsoft.com/en-us/linkedin/shared/references/v2/ads/adaccounts?context=linkedin/marketing/context). Required unless another facet is provided.",
      optional: true,
      async options() {
        const {
          searchAdAccounts,
          getSponsoredAccountUrn,
        } = this;
        const { elements } =  await searchAdAccounts();
        return elements.map(({
          id, name: label,
        }) => ({
          value: getSponsoredAccountUrn(id),
          label,
        }));
      },
    },
  },
};
