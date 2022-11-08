import microsoftTeams from "../../microsoft_teams.app.mjs";

export default {
  props: {
    microsoftTeams,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the YouTube API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  methods: {
    _getLastCreated() {
      return this.db.get("lastCreated");
    },
    _setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated);
    },
    isNew(resource, lastCreated) {
      if (!resource.createdDateTime || !lastCreated) {
        return true;
      }
      return Date.parse(resource.createdDateTime) > lastCreated;
    },
    async getNewPaginatedResources(fn, params, max, lastCreated) {
      const resources = [];
      const paginator = this.paginate(fn, params);

      for await (const resource of paginator) {
        const isNewResource = this.isNew(resource, lastCreated);
        if (isNewResource) {
          resources.push(resource);
        }
        if (!isNewResource || resources.length >= max) {
          break;
        }
      }
      return resources;
    },
    async *paginate(fn, params) {
      let nextLink;
      do {
        const response = nextLink
          ? await this.microsoftTeams.clientApiGetRequest(nextLink)
          : await fn(params);

        for (const value of response.value) {
          yield value;
        }

        nextLink = response["@odata.nextLink"];
      } while (nextLink);
    },
    getResources() {
      throw new Error("getResources is not implemented");
    },
  },
  async run() {
    let lastCreated = Date.parse(this._getLastCreated());

    const resources = await this.getResources(lastCreated);
    for (const resource of resources) {
      const { createdDateTime } = resource;
      if (!lastCreated || (createdDateTime && Date.parse(createdDateTime) > lastCreated)) {
        lastCreated = Date.parse(createdDateTime);
      }
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    }

    this._setLastCreated(lastCreated);
  },
};
