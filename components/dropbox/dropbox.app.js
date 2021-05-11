const Dropbox = require("dropbox").Dropbox;
const fetch = require("isomorphic-fetch");

module.exports = {
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
        return await this.pathOptions(query);
      },
    },
    recursive: {
      type: "boolean",
      label: "Recursive",
      description: "Also watch sub-directories and their contents.",
      optional: false,
      default: false,
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
    async pathOptions(path) {
      const limit = 50;
      let options = [];
      let entries, has_more, cursor;
      path = path === "/" || path === null ? "" : path;
      try {
        const dpx = await this.sdk();
        let files = await dpx.filesListFolder({ path, limit });
        if (files.result) {
          files = files.result;
        }
        do {
          ({ entries, has_more, cursor } = files);
          for (entry of entries) {
            if (entry[".tag"] == "folder") {
              options.push(entry.path_display);
            }
          }
          // TODO break after a certain number of folders has been found??
          if (has_more) {
            files = await dpx.filesListFolderContinue({ cursor });
            if (files.result) {
              files = files.result;
            }
          }
        } while (has_more);
        options = options.sort((a, b) => {
          return a.toLowerCase().localeCompare(b.toLowerCase());
        });
        if (path) {
          options.unshift(require("path").dirname(path));
        }
        options.unshift(path);
      } catch (err) {
        console.log(err);
        throw `Error connecting to Dropbox API to get directory listing for path: ${path}`;
      }
      const labeledOptions = options.map((opt) => {
        if (opt === "") {
          return { label: "/", value: "" };
        }
        return { label: opt, value: opt };
      });
      return { options: labeledOptions };
    },
    async initState(context) {
      const { path, recursive, db } = context;
      try {
        const fixedPath = path == "/" ? "" : path;
        const dpx = await this.sdk();
        let response = await dpx.filesListFolderGetLatestCursor({
          path: fixedPath,
          recursive,
        });
        if (response.result) {
          response = response.result;
        }
        const { cursor } = response;
        const state = { path, recursive, cursor };
        db.set("dropbox_state", state);
        return state;
      } catch (err) {
        console.log(err);
        throw `Error connecting to Dropbox API to get latest cursor for folder: ${path}${
          recursive ? " (recursive)" : ""
        }`;
      }
    },
    async getState(context) {
      const { path, recursive, db } = context;
      let state = db.get("dropbox_state");
      if (state == null || state.path != path || state.recursive != recursive) {
        state = await this.initState(context);
      }
      return state;
    },
    async getUpdates(context) {
      let ret = [];
      const state = await this.getState(context);
      if (state) {
        try {
          const { db } = context;
          let [cursor, has_more, entries] = [state.cursor, true, null];
          while (has_more) {
            const dpx = await this.sdk();
            let response = await dpx.filesListFolderContinue({ cursor });
            if (response.result) {
              response = response.result;
            }
            ({ entries, cursor, has_more } = response);
            ret = ret.concat(entries);
          }
          state.cursor = cursor;
          db.set("dropbox_state", state);
        } catch (err) {
          console.log(err);
          throw `Error connecting to Dropbox API to get list of updated files/folders for cursor: ${state.cursor}`;
        }
      }
      return ret;
    },
  },
};
