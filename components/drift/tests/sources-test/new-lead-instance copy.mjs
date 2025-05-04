import drift from "../../drift.app.mjs";
import db from "../dev-db.mjs";
import mockery$ from "../mockery-dollar.mjs";

const mockeryData = {
  db,
  source: "CHAT", // TEST VALUE: set to whatever source you're targeting
};

const testAction = {
  mockery: {
    drift,
    ...mockeryData,
  },
  $emit: (a, meta) => console.log("EMIT:", a, meta),

  key: "drift-new-lead-instant",
  name: "New Lead",
  description: "Emits an event when a new email is collected from a lead.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    drift,
    db: "$.service.db",
    source: {
      type: "string",
      label: "Lead Source",
      description: "Filter leads by source (e.g. 'chat', 'emailCapture')",
    },
    timer: {
      type: "$.interface.timer",
      label: "Polling Interval",
      description: "How often to poll Drift for new leads.",
    },
  },

  hooks: {
    async activate() {
      const {
        drift, db, source,
      } = this.mockery;

      await db.set("lastLead", null);

      const result = await drift.methods._makeRequest({
        $: drift.methods._mock$(),
        path: "/contacts?limit=100",
      });

      console.log(result);
      return;
      const leads = result.data.filter((c) =>
        c.attributes?.email && c.attributes?.lead_create_source === source);

      if (!leads.length) {
        console.log("No leads found.");
        return;
      }

      const sorted = leads.sort((a, b) => b.id - a.id);
      await db.set("lastLead", sorted[0].id);
      console.log(`Initialized with lead ID ${sorted[0].id}`);
    },
  },

  async run({ $ }) {

    return;
    const {
      db, drift, source,
    } = this.mockery;

    const allLeads = [];

    let result = await drift._makeRequest({
      $,
      path: "/contacts?limit=100",
    });

    const lastLead = await db.get("lastLead");

    if (!lastLead) {
      const leads = result.data.filter((c) =>
        c.attributes?.email && c.attributes?.lead_create_source === source);
      if (!leads.length) return;
      const newest = leads.sort((a, b) => b.id - a.id)[0].id;
      await db.set("lastLead", newest);
      console.log(`Initialized with ID ${newest}`);
      return;
    }

    let nextUrl = result.links?.next;
    const filterAndPush = (data) => {
      const leads = data.filter((c) =>
        c.attributes?.email && c.attributes?.lead_create_source === source);
      allLeads.push(...leads);
      return leads.some((c) => c.id === lastLead);
    };

    let isEnough = filterAndPush(result.data);

    while (!isEnough && nextUrl) {
      result = await drift.getNextPage($, nextUrl);
      isEnough = filterAndPush(result.data);
      nextUrl = result.links?.next;
    }

    const sorted = allLeads.sort((a, b) => a.id - b.id);
    const startIndex = sorted.findIndex((c) => c.id === lastLead);

    if (startIndex === -1) {
      throw new Error("Last lead not found in fetched data.");
    }

    for (let i = startIndex + 1; i < sorted.length; i++) {
      const lead = sorted[i];
      this.$emit(lead, {
        id: lead.id,
        summary: `New lead collected: ${lead.attributes.email}`,
        ts: lead.attributes.createdAt || Date.now(),
      });
    }

    const lastSeen = sorted[sorted.length - 1]?.id;
    if (lastSeen) await db.set("lastLead", lastSeen);
  },
};

async function runTest() {
  await testAction.hooks.activate.call(testAction);
  await testAction.run(mockery$);
}
runTest();
