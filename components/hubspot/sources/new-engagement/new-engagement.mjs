import {
  CRM_OBJECTS_VERSION,
  DEFAULT_LIMIT,
  ENGAGEMENT_CREATED_DATE_PROPERTY,
  ENGAGEMENT_OBJECT_TYPES,
  MAX_INITIAL_EVENTS,
} from "../../common/constants.mjs";
import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

const LABEL_BY_TYPE = Object.fromEntries(
  ENGAGEMENT_OBJECT_TYPES.map(({
    value, label,
  }) => [
    value,
    label,
  ]),
);

const SUMMARY_PROPERTY_BY_TYPE = Object.fromEntries(
  ENGAGEMENT_OBJECT_TYPES.map(({
    value, summaryProperty,
  }) => [
    value,
    summaryProperty,
  ]),
);

export default {
  ...common,
  key: "hubspot-new-engagement",
  name: "New Engagement",
  description: "Emit new event for each new engagement (call, email, meeting, note, postal mail, or task) created."
  + " Per-activity docs: [Calls](https://developers.hubspot.com/docs/api-reference/latest/crm/activities/calls/search/search-calls)"
  + " [Emails](https://developers.hubspot.com/docs/api-reference/latest/crm/activities/emails/search/search-emails)"
  + " [Meetings](https://developers.hubspot.com/docs/api-reference/latest/crm/activities/meetings/search/search-meetings)"
  + " [Notes](https://developers.hubspot.com/docs/api-reference/latest/crm/activities/notes/search/search-notes)"
  + " [Postal Mail](https://developers.hubspot.com/docs/api-reference/latest/crm/activities/postal-mail/search/search-postal-mail)"
  + " [Tasks](https://developers.hubspot.com/docs/api-reference/latest/crm/activities/tasks/search/search-tasks)"
  + " [See the documentation](https://developers.hubspot.com/docs/api-reference/latest/crm/using-object-apis)",
  version: "0.0.50",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    types: {
      type: "string[]",
      label: "Engagement Types",
      description: "Filter results by the type of engagement. Defaults to all types.",
      options: ENGAGEMENT_OBJECT_TYPES.map(({
        label, value,
      }) => ({
        label,
        value,
      })),
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getTs(engagement) {
      return Date.parse(engagement.createdAt);
    },
    generateMeta(engagement) {
      const { objectType } = engagement;
      const summaryValue =
        engagement.properties?.[SUMMARY_PROPERTY_BY_TYPE[objectType]] || engagement.id;
      return {
        id: engagement.id,
        summary: `New ${LABEL_BY_TYPE[objectType]}: ${summaryValue}`,
        ts: this.getTs(engagement),
      };
    },
    getSelectedTypes() {
      return this.types?.length
        ? this.types
        : ENGAGEMENT_OBJECT_TYPES.map(({ value }) => value);
    },
    async getObjectProperties(objectType) {
      const { results } = await this.hubspot.getProperties({
        objectType,
      });
      return results.map(({ name }) => name);
    },
    buildSearchParams(objectType, after, properties) {
      const filters = [];
      if (after) {
        filters.push({
          propertyName: ENGAGEMENT_CREATED_DATE_PROPERTY,
          operator: "GT",
          value: `${after}`,
        });
      }
      return {
        object: objectType,
        version: CRM_OBJECTS_VERSION,
        data: {
          limit: DEFAULT_LIMIT,
          properties,
          sorts: [
            {
              propertyName: ENGAGEMENT_CREATED_DATE_PROPERTY,
              direction: "DESCENDING",
            },
          ],
          filterGroups: filters.length
            ? [
              {
                filters,
              },
            ]
            : [],
        },
      };
    },
    async fetchEngagementsByType(objectType, after) {
      const engagements = [];
      try {
        const properties = await this.getObjectProperties(objectType);
        const params = this.buildSearchParams(objectType, after, properties);
        let paginate = true;
        while (paginate) {
          const {
            results = [], paging,
          } = await this.hubspot.searchCRM(params);
          for (const result of results) {
            engagements.push({
              ...result,
              objectType,
            });
          }
          // First run: a single newest-first page is enough to find the global
          // newest MAX_INITIAL_EVENTS. Subsequent runs: keep paging until every
          // engagement created after the cursor has been collected.
          if (!after || !paging?.next?.after) {
            paginate = false;
          } else {
            params.data.after = paging.next.after;
          }
        }
      } catch (error) {
        // A single object type failing (e.g. missing scope) should not break the
        // whole source; skip it and continue with the other types.
        console.warn(`Failed to fetch ${objectType} engagements: ${error.message}`);
      }
      return engagements;
    },
    emitEngagements(engagements) {
      for (const engagement of engagements) {
        this.emitEvent(engagement);
      }
    },
    async collectEngagements(after) {
      const types = this.getSelectedTypes();
      const perType = await Promise.all(
        types.map((objectType) => this.fetchEngagementsByType(objectType, after)),
      );
      return perType
        .flat()
        .sort((a, b) => this.getTs(b) - this.getTs(a));
    },
  },
  hooks: {
    async deploy() {
      // First deployment: emit only the most recent engagements as a sample,
      // newest-first, then pin the cursor to deploy time so run() is
      // new-events-only. This lives in deploy() (not run()) so the user's
      // deploy-time opt-out is honored (where $emit is a no-op). Pinning to
      // deployTs (rather than the oldest sampled timestamp) is what prevents
      // run() from re-fetching and re-emitting the sampled engagements, which
      // would otherwise bypass the opt-out. Every pre-existing engagement was
      // created <= deployTs, and anything created during collection has
      // createdAt > deployTs, so run() still catches genuinely new events.
      const deployTs = Date.now();
      const engagements = await this.collectEngagements(null);
      this.emitEngagements(engagements.slice(0, MAX_INITIAL_EVENTS));
      this._setAfter(deployTs);
    },
  },
  async run() {
    const after = this._getAfter();
    if (after == null) {
      // Safety net for instances that somehow reach run() without a cursor:
      // never emit retroactively from run(); just establish the cursor.
      this._setAfter(Date.now());
      return;
    }

    // Subsequent runs: every engagement was already filtered to created > cursor,
    // so emit them all and advance the cursor to the newest created timestamp.
    const engagements = await this.collectEngagements(after);
    if (!engagements.length) {
      return;
    }

    let maxTs = after;
    for (const engagement of engagements) {
      const ts = this.getTs(engagement);
      if (ts > maxTs) {
        maxTs = ts;
      }
    }
    this.emitEngagements(engagements);
    this._setAfter(maxTs);
  },
  sampleEmit,
};
