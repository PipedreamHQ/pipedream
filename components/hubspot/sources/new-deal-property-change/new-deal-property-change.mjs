import {
  DEFAULT_LIMIT, MAX_INITIAL_EVENTS,
} from "../../common/constants.mjs";
import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-deal-property-change",
  name: "New Deal Property Change",
  description: "Emit new event when a specified property is provided or updated on a deal. [See the documentation](https://developers.hubspot.com/docs/api/crm/deals)",
  version: "0.0.40",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    property: {
      type: "string",
      label: "Property",
      description: "The deal property to watch for changes",
      async options() {
        const properties = await this.hubspot.getDealProperties();
        return properties.map((property) => property.name);
      },
    },
  },
  hooks: {
    async deploy() {
      // Emit a capped, newest-first sample of already-changed deals on deploy
      // and store the cursor.
      const params = await this.getParams();
      await this.processResults(null, params);
    },
  },
  methods: {
    ...common.methods,
    getTs(deal) {
      const history = deal.propertiesWithHistory[this.property];
      if (!history || !(history.length > 0)) {
        return;
      }
      return Date.parse(history[0].timestamp);
    },
    generateMeta(deal) {
      const { id } = deal;
      const ts = this.getTs(deal);
      return {
        id: `${id}${ts}`,
        summary: `Deal ${id} updated`,
        ts,
      };
    },
    isRelevant(deal, updatedAfter) {
      return this.getTs(deal) > updatedAfter;
    },
    getParams(after) {
      const params = {
        object: "deals",
        data: {
          limit: DEFAULT_LIMIT,
          properties: [
            this.property,
          ],
          sorts: [
            {
              propertyName: "hs_lastmodifieddate",
              direction: "DESCENDING",
            },
          ],
          filterGroups: [
            {
              filters: [
                {
                  propertyName: this.property,
                  operator: "HAS_PROPERTY",
                },
              ],
            },
          ],
        },
      };
      if (after) {
        params.data.filterGroups[0].filters.push({
          propertyName: "hs_lastmodifieddate",
          operator: "GTE",
          value: after,
        });
      }
      return params;
    },
    batchGetDeals(inputs) {
      return this.hubspot.batchGetObjects({
        objectType: "deals",
        data: {
          properties: [
            this.property,
          ],
          propertiesWithHistory: [
            this.property,
          ],
          inputs,
        },
      });
    },
    async processEvents(resources, after, initialTs = Date.now()) {
      // Initial (deploy) run: no cursor yet. Emit only the newest
      // MAX_INITIAL_EVENTS as a sample, then store the cursor so subsequent
      // run()s never re-emit this historical backfill.
      if (!after) {
        const withTs = resources
          .map((deal) => ({
            deal,
            ts: this.getTs(deal),
          }))
          .filter(({ ts }) => ts)
          .sort((a, b) => a.ts - b.ts);

        if (!withTs.length) {
          // No usable timestamps to derive a cursor from, but still advance it
          // so the first run() does not treat itself as an initial run and emit
          // everything.
          this._setAfter(initialTs);
          return;
        }

        // withTs is oldest-first; take the newest sample from the tail and emit
        // it in chronological order (oldest first), matching the natural order
        // events would normally arrive in.
        for (const { deal } of withTs.slice(-MAX_INITIAL_EVENTS)) {
          this.emitEvent(deal);
        }
        // Store the newest timestamp actually observed in the response (the last
        // element, since withTs is oldest-first) as the cursor
        this._setAfter(withTs[withTs.length - 1].ts);
        return;
      }

      // Subsequent runs: emit everything changed after the stored cursor.
      let maxTs = after;
      for (const result of resources) {
        if (await this.isRelevant(result, after)) {
          this.emitEvent(result);
          const ts = this.getTs(result);
          if (ts > maxTs) {
            maxTs = ts;
          }
        }
      }
      this._setAfter(maxTs);
    },
    async processResults(after, params) {
      const properties = await this.hubspot.getDealProperties();
      const propertyNames = properties.map((property) => property.name);
      if (!propertyNames.includes(this.property)) {
        throw new Error(
          `Property "${this.property}" not supported for Deals. See Hubspot's default deal properties documentation - https://knowledge.hubspot.com/crm-deals/hubspots-default-deal-properties`,
        );
      }

      const initialTs = Date.now();
      const updatedDeals = await this.getPaginatedItems(
        this.hubspot.searchCRM,
        params,
        after,
      );

      if (!updatedDeals.length) {
        // On the initial (deploy) run with no matching deals, still set a
        // cursor so the first run() does not fall into the "emit everything"
        // branch.
        if (!after) {
          this._setAfter(initialTs);
        }
        return;
      }

      const results = await this.processChunks({
        batchRequestFn: this.batchGetDeals,
        chunks: this.getChunks(updatedDeals),
      });

      await this.processEvents(results, after, initialTs);
    },
  },
  sampleEmit,
};
