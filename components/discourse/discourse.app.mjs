import get from "lodash.get";
import sortBy from "lodash.sortby";
import axios from "axios";
import { nanoid } from "nanoid";

export default {
  type: "app",
  app: "discourse",
  propDefinitions: {
    topicId: {
      label: "Topic ID",
      type: "string",
      description: "The topic ID",
      async options({ page }) {
        const topics = await this.getTopics({
          params: {
            page,
          },
        });

        return topics.map((topic) => ({
          label: topic.title,
          value: topic.id,
        }));
      },
    },
    categories: {
      type: "string[]",
      label: "Categories",
      optional: true,
      description:
        "The Discourse categories you want to watch for changes. **Leave blank to watch all categories**.",
      async options({ page = 0 }) {
        // Categories endpoint does not implement pagination
        if (page !== 0) {
          return [];
        }

        const categories = await this.listCategories();
        if (!categories.length) {
          return [];
        }
        const rawOptions = categories.map((c) => ({
          label: c.name,
          value: c.id,
        }));
        const options = sortBy(rawOptions, [
          "label",
        ]);

        return {
          options,
        };
      },
    },
    eventTypes: {
      type: "string[]",
      label: "Event categories",
      description:
        "Which Discourse events should trigger this webhook? These map to the event types you see in the Webhook UI in your Discourse Admin settings.",
      options() {
        // https://github.com/discourse/discourse/blob/master/app/models/web_hook_event_type.rb
        return [
          {
            value: 1,
            label: "Topic Event",
          },
          {
            value: 2,
            label: "Post Event",
          },
          {
            value: 3,
            label: "User Event",
          },
          {
            value: 4,
            label: "Group Event",
          },
          {
            value: 5,
            label: "Category Event",
          },
          {
            value: 6,
            label: "Tag Event",
          },
          {
            value: 9,
            label: "Reviewable Event",
          },
          {
            value: 10,
            label: "Notification Event",
          },
          {
            value: 13,
            label: "Badge Grant Event",
          },
        ];
      },
    },
    // The following event names were retrieved from https://github.com/discourse/discourse/blob/master/spec/models/web_hook_spec.rb
    postEvents: {
      type: "string[]",
      label: "Events", // used in the context of the Post sources, this name makes sense
      description:
        "The type of topic events you'd like to emit from this source",
      options() {
        return [
          "post_created",
          "post_edited",
          "post_destroyed",
          "post_recovered",
        ];
      },
    },
    topicEvents: {
      type: "string[]",
      label: "Events", // used in the context of the Topic sources, this name makes sense
      description:
        "The type of topic events you'd like to emit from this source",
      options() {
        return [
          "topic_created",
          "topic_destroyed",
          "topic_recovered",
          "topic_archived_status_updated",
          "topic_closed_status_updated",
          "topic_visible_status_updated",
          "topic_edited",
        ];
      },
    },
  },
  methods: {
    _apiUrl() {
      return `https://${this.$auth.domain}`;
    },
    _apiUsername() {
      return this.$auth.api_username;
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _filterOnCategories(data, categories = []) {
      // If no categories were passed, the user isn't
      // filtering on category, so we return all items
      if (!categories.length) {
        return data;
      }

      // No way to filter items by category via API, so we filter here
      return data.filter(
        (el) => el.category_id && categories.includes(el.category_id.toString()),
      );
    },
    async _makeRequest(opts) {
      if (!opts.headers) opts.headers = {};
      opts.headers["Accept"] = "application/json";
      opts.headers["Content-Type"] = "application/json";
      opts.headers["Api-Username"] = this._apiUsername();
      opts.headers["Api-Key"] = this._apiKey();
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      const { path } = opts;
      delete opts.path;
      opts.url = `${this._apiUrl()}${path[0] === "/"
        ? ""
        : "/"}${path}`;
      return await axios(opts);
    },
    generateSecret() {
      return nanoid(12); // Discourse requires at least 12 bytes for secrets
    },
    // The Webhook API endpoints are not publicly documented, so were reverse
    // engineered from the Discourse code and HTTP requests from the admin UI.
    async createHook({
      endpoint,
      secret,
      wildcard_web_hook = false,
      group_ids = [],
      category_ids = [],
      tag_names = [],
      web_hook_event_type_ids = [],
    }) {
      const {
        data,
        status,
      } = await this._makeRequest({
        method: "POST",
        path: "/admin/api/web_hooks",
        data: {
          web_hook: {
            payload_url: endpoint,
            // 1 for json, 2 for x-www-form-urlencoded
            content_type: 1,
            secret,
            wildcard_web_hook,
            verify_certificate: true,
            active: true,
            web_hook_event_type_ids,
            category_ids,
            tag_names,
            group_ids,
          },
        },
        validateStatus: () => true,
      });

      if (status < 400) return data?.web_hook;
      console.log(`Request failed with status ${status}`);
      throw new Error(JSON.stringify(data, null, 2));
    },
    async deleteHook({ hookID }) {
      try {
        return await this._makeRequest({
          method: "DELETE",
          path: `/admin/api/web_hooks/${hookID}`,
        });
      } catch (err) {
        console.log("Failed to delete webhook: ", err);
      }
    },
    // https://docs.discourse.org/#tag/Posts/paths/~1posts.json/get
    async getLatestPosts(categories) {
      const { data } = await this._makeRequest({
        path: "/posts",
      });
      const posts = get(data, "latest_posts", []);
      return this._filterOnCategories(posts, categories);
    },
    // https://docs.discourse.org/#tag/Topics/paths/~1latest.json/get
    async getLatestTopics(categories) {
      const { data } = await this._makeRequest({
        path: "/latest",
      });
      const topics = get(data, "topic_list.topics", []);
      return this._filterOnCategories(topics, categories);
    },
    async listCategories() {
      const { data } = await this._makeRequest({
        path: "/categories",
      });
      return get(data, "category_list.categories", []);
    },
    async listUsers() {
      const { data } = await this._makeRequest({
        path: "/admin/users",
      });
      return data;
    },
    async getTopics({ ...args }) {
      const response = await this._makeRequest({
        path: "/latest.json",
        ...args,
      });

      return response.data?.topic_list?.topics ?? [];
    },
    async createPost({ ...args }) {
      const response = await this._makeRequest({
        path: "/posts.json",
        method: "post",
        ...args,
      });

      return response.data;
    },
  },
};
