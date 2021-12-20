import dropbox from "dropbox";
import fetch from "isomorphic-fetch";
import config from "./config.mjs";

const Dropbox = dropbox.Dropbox;

export default {
  type: "app",
  app: "dropbox",
  propDefinitions: {
    path: {
      type: "string",
      label: "Path",
      description: "Path to the folder you want to watch for changes.",
      optional: false,
      useQuery: true,
      async options({ query }) {
        return this.getPathOptions(query);
      },
    },
    pathFile: {
      type: "string",
      label: "Path",
      description: "The file path",
      optional: false,
    },
    recursive: {
      type: "boolean",
      label: "Recursive",
      description: "Also watch sub-directories and their contents.",
      optional: false,
      default: false,
    },
    query: {
      type: "string",
      label: "Query",
      description: "The string to search for. May match across multiple fields based on the request arguments.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Specify a max amount of register to be fetched.",
      optional: true,
      min: 1,
    },
  },
  methods: {
    async sdk() {
      const baseClientOpts = {
        accessToken: this.$auth.oauth_access_token,
        fetch,
      };

      // In order to properly set the [root
      // path](https://www.dropbox.com/developers/reference/path-root-header-modes)
      // to use in every API request we first need to extract some information
      // from the authenticated user's account, for which we need to create a
      // client and issue an API request.
      const dpx = new Dropbox(baseClientOpts);
      const { result } = await dpx.usersGetCurrentAccount();

      const pathRoot = JSON.stringify({
        ".tag": "root",
        "root": result.root_info.root_namespace_id,
      });
      return new Dropbox({
        ...baseClientOpts,
        pathRoot,
      });
    },
    async getPathOptions(path) {
      // todo: IMPROVE 409 ERROR, THERE IS SOME WAY TO DO IT?
      try {
        const LIMIT = 100;

        let data = [];
        let cursor = null;
        path = path === "/" || path === null
          ? ""
          : path;
        const dpx = await this.sdk();

        let res = await dpx.filesListFolder({
          path,
          limit: LIMIT,
        });

        if (!res.result.has_more) {
          return res.result.entries.map((folder) => ({
            label: folder.path_display,
            value: folder.path_lower,
          }));
        }

        data = res.result.entries.map((folder) => ({
          label: folder.path_display,
          value: folder.path_lower,
        }));
        cursor = res.result.cursor;
        do {
          const res = await dpx.filesListFolderContinue({
            cursor,
          });
          data = data.concat(res.result?.entries.map((folder) => ({
            label: folder.path_display,
            value: folder.path_lower,
          })));
          cursor = res.result.cursor;
          if (!res.result.has_more) {
            break;
          }
        } while (true);
        return data;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    async initState(context) {
      const {
        path,
        recursive,
        db,
      } = context;
      try {
        const fixedPath = path == "/"
          ? ""
          : path;
        const dpx = await this.sdk();
        let response = await dpx.filesListFolderGetLatestCursor({
          path: fixedPath,
          recursive,
        });
        if (response.result) {
          response = response.result;
        }
        const { cursor } = response;
        const state = {
          path,
          recursive,
          cursor,
        };
        db.set("dropbox_state", state);
        return state;
      } catch (err) {
        console.log(err);
        throw `Error connecting to Dropbox API to get latest cursor for folder: ${path}${
          recursive
            ? " (recursive)"
            : ""
        }`;
      }
    },
    async getState(context) {
      const {
        path,
        recursive,
        db,
      } = context;
      let state = db.get("dropbox_state");
      if (state == null || state.path != path || state.recursive != recursive) {
        state = await this.initState(context);
      }
      return state;
    },
    async createFolder(args) {
      const dpx = await this.sdk();
      return dpx.filesCreateFolderV2(args);
    },
    async listFileRevisions(args) {
      const dpx = await this.sdk();
      return dpx.filesListRevisions(args);
    },
    async searchFilesFolders(params, limit) {
      try {
        const dpx = await this.sdk();
        let data = [];
        let cursor = null;

        const args = {
          ...params,
          options: {
            ...params.options,
            max_results: limit <= config.SEARCH_FILE_FOLDERS.DEFAULT_MAX_RESULTS
              ? limit
              : config.SEARCH_FILE_FOLDERS.DEFAULT_MAX_RESULTS,
          },
        };
        console.log(args);
        let res = await dpx.filesSearchV2(args);

        if (!res.result?.has_more || limit <= config.SEARCH_FILE_FOLDERS.DEFAULT_MAX_RESULTS) {
          return res.result?.matches;
        }

        data = res.result?.matches;
        cursor = res.result?.cursor;
        do {
          const res = await dpx.filesSearchContinueV2({
            cursor,
          });
          data = data.concat(res.result?.matches);
          cursor = res.result?.cursor;
          if (!res.result?.has_more || data.length >= limit) {
            break;
          }
        } while (true);
        return data;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
};
