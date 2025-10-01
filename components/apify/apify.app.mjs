import { LIMIT } from "./common/constants.mjs";
import { ApifyClient } from "apify-client";

export default {
  type: "app",
  app: "apify",
  propDefinitions: {
    keyValueStoreId: {
      type: "string",
      label: "Key-Value Store Id",
      description: "The Id of the key-value store.",
      async options({ page }) {
        const { items } = await this.listKeyValueStores({
          offset: LIMIT * page,
          limit: LIMIT,
          unnamed: true,
        });

        return items.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    actorId: {
      type: "string",
      label: "Actor ID",
      description: "Actor ID or a tilde-separated owner's username and Actor name",
      async options({
        page, actorSource,
      }) {
        actorSource ??= "recently-used";
        const listFn = actorSource === "store"
          ? this.listActors
          : this.listUserActors;
        const { items } = await listFn({
          offset: LIMIT * page,
          limit: LIMIT,
        });

        return items.map((actor) => ({
          label: this.formatActorOrTaskLabel(actor),
          value: actor.id,
        }));
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task to monitor.",
      async options({ page }) {
        const { items } = await this.listTasks({
          offset: LIMIT * page,
          limit: LIMIT,
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
      description: "The ID of the dataset to retrieve items within",
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
      description: "Specifies the Actor build to run. The accepted value is the build tag. If not provided, the default build will be used.",
      async options({ actorId }) {
        const { taggedBuilds } = await this.getActor({
          actorId,
        });

        return Object.entries(taggedBuilds).map(([
          name,
        ]) => name);
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
      description: "The maximum number of items to return",
      default: LIMIT,
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number records to skip before returning results",
      default: 0,
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
    getActorRun({ runId }) {
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
      taskId, params,
    }) {
      return this._client().task(taskId)
        .start(params);
    },
    getActor({ actorId }) {
      return this._client().actor(actorId)
        .get();
    },
    async getBuild(actorId, buildTag) {
      // Get actor details
      const actor = await this._client().actor(actorId)
        .get();

      if (!actor) {
        throw new Error(`Actor ${actorId} not found.`);
      }

      if (!buildTag) {
        buildTag = actor.defaultRunOptions.build;
      }

      const { taggedBuilds } = actor;

      if (taggedBuilds[buildTag]) {
        return this._client().build(taggedBuilds[buildTag].buildId)
          .get();
      } else {
        throw new Error(
          `Actor ${actorId} has no build tagged "${buildTag}". Please build the actor first.`,
        );
      }
    },
    listActors(opts = {}) {
      return this._client().store()
        .list(opts);
    },
    listUserActors(opts = {}) {
      return this._client().actors()
        .list({
          my: true,
          sortBy: "stats.lastRunStartedAt",
          desc: true,
          ...opts,
        });
    },
    listTasks(opts = {}) {
      return this._client().tasks()
        .list(opts);
    },
    listBuilds({ actorId }) {
      return this._client().actor(actorId)
        .builds()
        .list();
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
    getKVSRecord(kvsId, recordKey) {
      return this._client().keyValueStore(kvsId)
        .getRecord(recordKey);
    },
    getKVSRecordUrl(kvsId, recordKey) {
      return this._client().keyValueStore(kvsId)
        .getRecordPublicUrl(recordKey);
    },
    runTaskSynchronously({
      taskId, params,
    }) {
      return this._client().task(taskId)
        .call({}, params);
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
