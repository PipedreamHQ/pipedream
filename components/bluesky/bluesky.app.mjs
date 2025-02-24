import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "bluesky",
  propDefinitions: {
    postUrl: {
      type: "string",
      label: "Post URL",
      description: "The URL will look like `https://bsky.app/profile/myhandle.bsky.social/post/3le7x3qgmaw23`.",
    },
    authorId: {
      type: "string",
      label: "Author ID",
      description: "The ID of the author to track posts.",
    },
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The ID of the account to monitor for new followers.",
    },
  },
  methods: {
    getHandleAndPostIdFromUrl(postUrl) {
      const match = postUrl?.match(constants.HANDLE_AND_POST_ID_REGEX);
      if (!match) {
        throw new Error("Invalid post URL");
      }
      const {
        handle,
        postId,
      } = match.groups;

      return {
        handle,
        postId,
      };
    },
    getPostUri(postId, did = this.getDID()) {
      return `at://${did}/${constants.RESOURCE_TYPE.POST}/${postId}`;
    },
    getDID() {
      return this.$auth.did;
    },
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
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
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    createRecord(args = {}) {
      return this.post({
        path: "/com.atproto.repo.createRecord",
        ...args,
        data: {
          ...args.data,
          repo: this.getDID(),
        },
      });
    },
    getRecord(args = {}) {
      return this._makeRequest({
        path: "/com.atproto.repo.getRecord",
        ...args,
      });
    },
    resolveHandle(args = {}) {
      return this._makeRequest({
        path: "/com.atproto.identity.resolveHandle",
        ...args,
      });
    },
    getAuthorFeed(args = {}) {
      return this._makeRequest({
        path: "/app.bsky.feed.getAuthorFeed",
        ...args,
      });
    },
    getTimeline(args = {}) {
      return this._makeRequest({
        path: "/app.bsky.feed.getTimeline",
        ...args,
      });
    },
    getFollowers(args = {}) {
      return this._makeRequest({
        path: "/app.bsky.graph.getFollowers",
        ...args,
      });
    },
    async *getIterations({
      resourcesFn, resourcesFnArgs, resourceName,
      lastDateAt, dateField,
      max = constants.DEFAULT_MAX,
    }) {
      let cursor;
      let resourcesCount = 0;
      const firstRun = !lastDateAt;

      while (true) {
        const response = await resourcesFn({
          ...resourcesFnArgs,
          params: {
            ...resourcesFnArgs?.params,
            cursor,
            limit: constants.DEFAULT_LIMIT,
          },
        });

        const nextResources = utils.getNestedProperty(response, resourceName);

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          const isLastDateGreater = lastDateAt
            && Date.parse(lastDateAt) > Date.parse(utils.getNestedProperty(resource, dateField));

          if (isLastDateGreater) {
            console.log(`Last date is greater than the current resource date in ${dateField}`);
            return;
          }

          if (!isLastDateGreater) {
            yield resource;
            resourcesCount += 1;
          }

          if (resourcesCount >= max) {
            console.log("Reached max resources");
            return;
          }
        }

        if (firstRun) {
          console.log("First run: only one request processed");
          return;
        }

        if (nextResources.length < constants.DEFAULT_LIMIT) {
          console.log("No next page found");
          return;
        }

        cursor = response.cursor;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
