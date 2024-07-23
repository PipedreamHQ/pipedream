import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "paved",
  propDefinitions: {
    slug: {
      type: "string",
      label: "Newsletter Slug",
      description: "Your newsletter slug.",
      async options() {
        const newsletters = await this.listNewsletters();
        return newsletters.map(({
          name: label, slug: value,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getUrl(path, versionPath = constants.API.PUBLISHER_PATH) {
      return `${constants.BASE_URL}${versionPath}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        Authorization: `Token ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    listNewsletters(args = {}) {
      return this._makeRequest({
        path: "/newsletters",
        ...args,
      });
    },
    listSponsorships({
      slug, ...args
    } = {}) {
      return this._makeRequest({
        path: `/newsletters/${slug}/sponsorships`,
        ...args,
      });
    },
    async *getIterations({
      resourcesFn, resourcesFnArgs,
      fromDate,
      max = constants.DEFAULT_MAX,
    }) {
      let resourcesCount = 0;

      while (true) {
        const nextResources =
          await resourcesFn({
            ...resourcesFnArgs,
            params: {
              ...resourcesFnArgs?.params,
              limit: constants.DEFAULT_LIMIT,
              from_date: fromDate,
            },
          });

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            console.log("Reached max resources");
            return;
          }
        }

        if (nextResources.length < constants.DEFAULT_LIMIT) {
          console.log("No next page found");
          return;
        }

        fromDate = nextResources[nextResources.length - 1].run_date;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
