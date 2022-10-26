import { promisify } from "util";
import maxBy from "lodash.maxby";
import common from "../common/common.mjs";
import constants from "../common/constants.mjs";

const pause = promisify((delay, fn) => setTimeout(fn, delay));
const { discord } = common.props;

export default {
  ...common,
  methods: {
    /**
     * This is the generic function to paginate resources in Discord.
     * It supports retrying on errors up to 3 times.
     *
     * @param {Object} args - This will contain the following properties:
     * @param {Function} args.resourceFn - The function to call to fetch resources and be paginated
     * @param {Object} args.resourceFnArgs - The arguments to pass to the `args.resourceFn` function
     * @param {string} args.before - A query string param to pass to the `args.resourceFn` function
     *  that will get the first page results
     * @param {string} args.after - A query string param to pass to the `args.resourceFn` function
     *  that will get the next page results
     * @param {string} args.around - A query string param to pass to the `args.resourceFn` function
     *  that will get the next page results
     * @param {number} args.limit - The number of results to fetch per page
     * @param {number} args.max - The maximum number of records to return as a whole
     * @param {string} args.paginationKey - The key to use to paginate the results
     * @param {Function} args.mapper - A function to map each resource to a new object
     *
     * @returns {Array} The mapped results for the whole pagination
     */
    async paginateResources({
      resourceFn,
      resourceFnArgs,
      before,
      after,
      around,
      limit = constants.DEFAULT_PAGE_LIMIT,
      max = constants.DEFAULT_MAX_ITEMS,
      paginationKey = constants.PAGINATION_KEY.BEFORE,
      mapper,
    }) {
      const hasFilter = before || after || around;
      let resources = [];
      let nextResources = [];
      let lastId;

      do {
        const lastLimit = max - resources.length;

        const params = !resources.length && hasFilter
          ? {
            limit,
            before,
            after,
            around,
          }
          : {
            limit: lastLimit < limit
              ? lastLimit
              : limit,
            [paginationKey]: lastId,
          };

        nextResources = await this.retryFn({
          resourceFn,
          resourceFnArgs: {
            ...resourceFnArgs,
            params,
          },
        });

        if (!limit) {
          limit = nextResources.length;
        }

        const mappedResources = nextResources.map(mapper ?? ((resource) => resource));
        const lastResource = maxBy(mappedResources, ({ id }) => id);

        lastId = lastResource?.id;
        resources = resources.concat(nextResources);

      } while (nextResources.length && resources.length < max);

      return resources;
    },
    async retryFn({
      resourceFn, resourceFnArgs, retries = constants.DEFAULT_NUMBER_OF_RETRIES,
    }) {
      try {
        return resourceFn(resourceFnArgs);

      } catch (error) {
        if (retries <= 1) {
          throw new Error(error);
        }

        const { response } = error;
        const delay = response
          ? response.headers[constants.HEADER_RETRY_AFTER]
          : constants.DEFAULT_RETRY_AFTER_MS;

        await pause(delay);

        return this.retryFn({
          resourceFn,
          resourceFnArgs,
          retries: retries - 1,
        });
      }
    },
  },
  props: {
    ...common.props,
    channelId: {
      propDefinition: [
        discord,
        "channelId",
        ({ guildId }) => ({
          guildId,
          notAllowedChannels: constants.NOT_ALLOWED_CHANNELS,
        }),
      ],
    },
  },
};
