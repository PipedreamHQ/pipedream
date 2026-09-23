import { LIMIT } from "./common/constants.mjs";
import { ApifyClient } from "apify-client";

export default {
  type: "app",
  app: "apify",
  propDefinitions: {
    keyValueStoreId: {
      type: "string",
      label: "Key-Value Store ID",
      description: "The ID of the key-value store",
      async options({
        page, unnamed = true,
      }) {
        const { items } = await this.listKeyValueStores({
          offset: LIMIT * page,
          limit: LIMIT,
          unnamed,
        });

        return items.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    keyValueStoreKey: {
      type: "string",
      label: "Record key",
      description: "The key of the record. Pick an existing key, or enter it manually.",
      async options({
        keyValueStoreId, prevContext,
      }) {
        if (!keyValueStoreId) {
          return [];
        }
        const {
          items, isTruncated, nextExclusiveStartKey,
        } = await this.listKeyValueStoreKeys(keyValueStoreId, {
          limit: LIMIT,
          exclusiveStartKey: prevContext?.exclusiveStartKey,
        });
        return {
          options: items.map(({ key }) => key),
          context: {
            exclusiveStartKey: isTruncated
              ? nextExclusiveStartKey
              : undefined,
          },
        };
      },
    },
    actorId: {
      type: "string",
      label: "Actor",
      description: "Select an Actor from the dropdown, enter an Actor ID, or use a tilde-separated owner/name identifier (e.g. `apify~web-scraper`). If the list is empty, switch \"Search Actors from\" to **Apify Store Actors**.",
      async options({
        page, actorSource,
      }) {
        actorSource ??= "recently-used";
        return await this.getActorOptions({
          page,
          actorSource,
        });
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task to monitor.",
      async options({
        page, desc = false,
      }) {
        const { items } = await this.listTasks({
          offset: LIMIT * page,
          limit: LIMIT,
          desc,
        });

        return items.map((task) => ({
          label: this.formatActorOrTaskLabel(task),
          value: task.id,
        }));
      },
    },
    datasetId: {
      type: "string",
      label: "Dataset ID",
      description: "Select a dataset, or enter a Dataset ID or `username/dataset-name`",
      async options({ page }) {
        const { items } = await this.listDatasets({
          offset: LIMIT * page,
          limit: LIMIT,
          desc: true,
          unnamed: true,
        });
        return items?.map(({
          id: value, name,
        }) => ({
          label: name || "unnamed",
          value,
        })) || [];
      },
    },
    buildTag: {
      type: "string",
      label: "Build",
      description: "Actor build to run. Pick a tag from the list or enter a build number (e.g. `0.1.2`). Defaults to the Actor's default build.",
      async options({ actorId }) {
        if (!actorId) {
          return [];
        }

        const { taggedBuilds = {} } = await this.getActor({
          actorId,
        });

        return Object.entries(taggedBuilds).map(([
          tag,
          info,
        ]) => ({
          label: info?.buildNumber
            ? `${tag} (${info.buildNumber})`
            : tag,
          value: tag,
        }));
      },
    },
    clean: {
      type: "boolean",
      label: "Clean",
      description: "Return only non-empty items and skips hidden fields (i.e. fields starting with the # character)",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "An array of fields which should be picked from the items, only these fields will remain in the resulting record objects.",
      optional: true,
    },
    omit: {
      type: "string[]",
      label: "Omit",
      description: "An array of fields which should be omitted from the items",
      optional: true,
    },
    flatten: {
      type: "string[]",
      label: "Flatten",
      description: "An array of fields which should transform nested objects into flat structures. For example, with `flatten=\"foo\"` the object `{\"foo\":{\"bar\": \"hello\"}}` is turned into `{\"foo.bar\": \"hello\"}`",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of items to return. Leave empty to return all items",
      min: 1,
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of records to skip before returning results. Leave empty to start from the first item",
      min: 0,
      optional: true,
    },
  },
  methods: {
    _client() {
      return new ApifyClient({
        token: this.$auth.api_token,
        requestInterceptors: [
          (config) => ({
            ...config,
            headers: {
              ...(config.headers || {}),
              "x-apify-integration-platform": "pipedream",
            },
          }),
        ],
      });
    },
    async getActorOptions({
      page = 0, actorSource = "recently-used",
    }) {
      const listFn = actorSource === "store"
        ? this.listActors
        : this.listUserActors;

      const { items } = await listFn({
        offset: LIMIT * page,
        limit: LIMIT,
      });

      if (page === 0 && items.length === 0 && actorSource !== "store") {
        return [
          {
            label: "No recent Actors, switch to \"Apify Store Actors\" above",
            value: "",
          },
        ];
      }

      return items.map((actor) => ({
        label: this.formatActorOrTaskLabel(actor),
        value: actor.id,
      }));
    },
    getAuthToken() {
      return this.$auth.api_token;
    },
    createHook(opts = {}) {
      return this._client().webhooks()
        .create(opts);
    },
    deleteHook(hookId) {
      return this._client().webhook(hookId)
        .delete();
    },
    runActor({
      actorId, input, options,
    }) {
      return this._client().actor(actorId)
        .call(input, options);
    },
    getRun({ runId }) {
      return this._client().run(runId)
        .get();
    },
    runActorAsynchronously({
      actorId, data, params,
    }) {
      return this._client().actor(actorId)
        .start(data, params);
    },
    runTask({
      taskId, params, input,
    }) {
      return this._client().task(taskId)
        .start(input, params);
    },
    getTask(taskId) {
      return this._client().task(taskId)
        .get();
    },
    getActor({ actorId }) {
      return this._client().actor(actorId)
        .get();
    },
    async resolveBuildId(actorId, buildRef) {
      const actor = await this._client().actor(actorId)
        .get();

      if (!actor) {
        throw new Error(`Actor ${actorId} not found.`);
      }

      if (!buildRef) {
        buildRef = actor.defaultRunOptions.build;
      }

      const taggedBuilds = actor.taggedBuilds ?? {};

      if (taggedBuilds[buildRef]?.buildId) {
        return taggedBuilds[buildRef].buildId;
      }

      // Builds can span multiple pages
      for (let offset = 0; ; offset += LIMIT) {
        const { items: builds = [] } = await this.listBuilds({
          actorId,
          desc: true,
          offset,
          limit: LIMIT,
        });

        const match = builds.find(({ buildNumber }) => buildNumber === buildRef);
        if (match) {
          return match.id;
        }

        if (builds.length < LIMIT) {
          break;
        }
      }

      throw new Error(
        `No build with tag or number "${buildRef}" found for actor ${actorId}.`,
      );
    },
    async getBuild(actorId, buildRef) {
      const buildId = await this.resolveBuildId(actorId, buildRef);
      return this._client().build(buildId)
        .get();
    },
    listActors(opts = {}) {
      return this._client().store()
        .list(opts);
    },
    listUserActors(opts = {}) {
      return this._client().actors()
        .list({
          sortBy: "stats.lastRunStartedAt",
          desc: true,
          ...opts,
        });
    },
    listTasks(opts = {}) {
      return this._client().tasks()
        .list(opts);
    },
    listBuilds({
      actorId, ...opts
    }) {
      return this._client().actor(actorId)
        .builds()
        .list(opts);
    },
    listKeyValueStores(opts = {}) {
      return this._client().keyValueStores()
        .list(opts);
    },
    listDatasets(opts = {}) {
      return this._client().datasets()
        .list(opts);
    },
    listDatasetItems({
      datasetId, params,
    }) {
      return this._client().dataset(datasetId)
        .listItems(params);
    },
    listKeyValueStoreKeys(kvsId, opts = {}) {
      return this._client().keyValueStore(kvsId)
        .listKeys(opts);
    },
    getKVSRecord(kvsId, recordKey) {
      return this._client().keyValueStore(kvsId)
        .getRecord(recordKey);
    },
    getKVSRecordUrl(kvsId, recordKey) {
      return this._client().keyValueStore(kvsId)
        .getRecordPublicUrl(recordKey);
    },
    setKeyValueStoreRecord({
      storeId, key, value, contentType,
    }) {
      return this._client().keyValueStore(storeId)
        .setRecord({
          key,
          value,
          contentType,
        });
    },
    formatActorOrTaskLabel({
      title, username, name,
    }) {
      if (title) {
        return `${title} (${username}/${name})`;
      }
      return `${username}/${name}`;
    },
  },
};
