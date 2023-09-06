main_example = """Here's an example Pipedream app for Raindrop:

```javascript
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "raindrop",
  propDefinitions: {
    collectionId: {
      type: "string",
      label: "Collection ID",
      description: "The collection ID",
      async options() {
        const { items } = await this.getCollections();
        return items.map((e) => ({
          value: e._id,
          label: e.title,
        }));
      },
    },
    raindropId: {
      type: "string",
      label: "Bookmark ID",
      description: "Existing Bookmark ID",
      async options({
        prevContext, collectionId,
      }) {
        const page = prevContext.page
          ? prevContext.page
          : 0;
        const { items } = await this.getRaindrops(this, collectionId, {
          page,
        });
        return {
          options: items.map((e) => ({
            value: e._id,
            label: e.title,
          })),
          context: {
            page: page + 1,
          },
        };
      },
    },
  },
  methods: {
    async _makeRequest($ = this, opts) {
      const {
        method = "get",
        path,
        data,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `https://api.raindrop.io/rest/v1${path}`,
        headers: {
          ...opts.headers,
          "user-agent": "@PipedreamHQ/pipedream v0.1",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
      });
    },
    async getCollections($) {
      return this._makeRequest($, {
        path: "/collections",
      });
    },
    async getRaindrops($, collectionId, params) {
      return this._makeRequest($, {
        path: `/raindrops/${collectionId}`,
        params,
      });
    },
  },
};
```

This object contains a `propDefinitions` property, which contains the definitions for the props of the app.

The propDefinitions object contains two props: collectionId and raindropId. The collectionId prop is a string prop. The raindropId prop is also a string prop. The propDefinitions object also contains an `options` method. The `options` method is an optional method that can be defined on a prop. It is used to dynamically generate the options for a prop and can return a static array of options or a Promise that resolves to an array of options.

This object contains a `props` property, which defines a single prop of type "app":

```javascript
import { axios } from "@pipedream/platform";
export default {
  type: "app",
  app: "the_app_name",
  propDefinitions: {
    prop_key: {
      type: "string",
      label: "Prop Label",
      description: "A description of the prop",
      async options() {
        const static_options = ["option 1", "option 2"]; // a static array of options
        const dynamic_options = await this.getOptions(); // a Promise that resolves to an array of options.
        return dynamic_options; // return the options
      },
    }
  },
  methods: {
    async _makeRequest($ = this, opts) {
      const {
        method = "get",
        path,
        data,
        params,
        ...otherOpts
      } = opts;
      return await axios($, {
        ...otherOpts,
        method,
        url: `https://api.the_app_name.com${path}`, // the base URL of the app API
        headers: {
          ...opts.headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`, // the authentication type depends on the app
        },
        params,
        data,
      })
    },
    async getOptions() {
      // the code to get the options
      return await this._makeRequest({
        ...opts,
      })
    },
  },
}
```"""
