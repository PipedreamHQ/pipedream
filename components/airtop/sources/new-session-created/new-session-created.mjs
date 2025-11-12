import common from "../common/polling.mjs";

export default {
  ...common,
  key: "airtop-new-session-created",
  name: "New Session Created",
  description: "Emit new event when a new session is created in Airtop. [See the documentation](https://docs.airtop.ai/api-reference/airtop-api/sessions/list)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getResources(lastTs) {
      const resources = [];
      let hasMore = true;
      let offset = 0;
      const limit = 25;
      const isFirstRun = !lastTs;

      while (hasMore) {
        const data = await this.airtop.listSessions({
          params: {
            limit,
            offset,
          },
        });

        if (!data?.sessions?.length) {
          break;
        }

        for (const resource of data.sessions) {
          const isNewResource = this.isNew(resource, lastTs);
          if (isNewResource) {
            resources.push(resource);
          }
        }

        hasMore = data.pagination?.hasMore;
        offset = data.pagination?.nextOffset;

        // Stop on first run or on last page
        if (isFirstRun || !hasMore) {
          break;
        }
      }

      return resources;
    },
    generateMeta(session) {
      return {
        id: session.id,
        summary: `New Session: ${session.id.slice(0, 8)}`,
        ts: new Date(session.dateCreated).getTime(),
      };
    },
  },
};

