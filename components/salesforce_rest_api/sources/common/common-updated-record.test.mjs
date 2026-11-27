// Run from the repository root with node --test.
import assert from "node:assert/strict";
import test from "node:test";
import salesforce from "../../salesforce_rest_api.app.mjs";
import common from "./common-updated-record.mjs";

const START = "2026-11-01T00:00:00.000Z";
const END = "2026-11-01T01:00:00.000Z";
const MODIFIED = "2026-11-01T00:05:00.000Z";
const NEXT = "/services/data/v65.0/query/01gExample-2000";
const WINDOW = {
  startTimestamp: START,
  endTimestamp: END,
};
const updated = (id) => ({
  Id: id,
  Name: id,
  LastModifiedDate: MODIFIED,
});
const history = (id) => ({
  OpportunityId: id,
});
const setup = (events = [
  updated("a"),
  updated("b"),
]) => {
  const emitted = [];
  const writes = [];
  const values = new Map();
  const context = {
    ...common.methods,
    fields: [
      "StageName",
    ],
    getObjectType: () => "Opportunity",
    getNameField: () => "Name",
    getObjectTypeColumns: () => [],
    paginate: async () => events,
    db: {
      get: (key) => values.get(key),
      set(key, value) {
        writes.push(key);
        values.set(key, value);
      },
    },
    $emit(item, meta) {
      emitted.push([
        item.Id,
        meta.id,
      ]);
    },
  };
  context.generateTimerMeta = context.generateTimerMeta.bind(context);
  return {
    context,
    emitted,
    values,
    writes,
  };
};

test("matches records found only on a later field-history result page", async () => {
  const {
    context, emitted, values,
  } = setup([
    updated("a"),
    updated("b"),
    updated("c"),
  ]);
  const requests = [];
  context.query = async () => ({
    nextRecordsUrl: NEXT,
    records: [
      history("a"),
    ],
  });
  context.salesforce = {
    ...salesforce.methods,
    _baseApiUrl: () => "https://example.salesforce.com",
    async _makeRequest(options) {
      requests.push(options.url);
      return {
        records: [
          history("b"),
        ],
      };
    },
  };

  await context.processTimerEvent(WINDOW);

  assert.deepEqual(requests, [
    `https://example.salesforce.com${NEXT}`,
  ]);
  assert.deepEqual(emitted.map(([
    id,
  ]) => id), [
    "a",
    "b",
  ]);
  assert.equal(values.get("latestDateCovered"), MODIFIED);
  assert.equal(values.get("latestIdCovered"), "c");
});

test("does not advance the checkpoint after a failed result page and retries the same records", async () => {
  const {
    context, emitted, values, writes,
  } = setup();
  context.query = async () => ({
    nextRecordsUrl: NEXT,
    records: [
      history("a"),
    ],
  });
  let fail = true;
  context.salesforce = {
    async queryMore() {
      if (fail) {
        throw new Error("temporary query failure");
      }
      return {
        records: [
          history("b"),
        ],
      };
    },
  };

  await assert.rejects(context.processTimerEvent(WINDOW), /temporary query failure/);
  assert.deepEqual(writes, []);
  assert.deepEqual(emitted, []);

  fail = false;
  await context.processTimerEvent(WINDOW);
  assert.deepEqual(emitted.map(([
    id,
  ]) => id), [
    "a",
    "b",
  ]);
  assert.equal(values.get("latestIdCovered"), "b");
});

test("does not discard a failed history batch after another batch succeeded", async () => {
  const events = Array.from({
    length: 201,
  }, (_, i) => updated(String(i)));
  const {
    context, emitted, writes,
  } = setup(events);
  let queries = 0;
  context.query = async () => {
    if (++queries === 2) {
      throw new Error("second batch failure");
    }
    return {
      records: [
        history("0"),
      ],
    };
  };

  await assert.rejects(context.processTimerEvent(WINDOW), /second batch failure/);
  assert.deepEqual(emitted, []);
  assert.deepEqual(writes, []);
});

test("keeps the unfiltered fallback when no first-page history query succeeds", async () => {
  const {
    context, emitted, values,
  } = setup();
  context.query = async () => {
    throw new Error("field history unavailable");
  };

  await context.processTimerEvent(WINDOW);
  assert.deepEqual(emitted.map(([
    id,
  ]) => id), [
    "a",
    "b",
  ]);
  assert.equal(values.get("latestIdCovered"), "b");
});

test("keeps the checkpoint and reuses stable event IDs if a partial publish fails", async () => {
  const {
    context, writes, values,
  } = setup();
  context.fields = [];
  const committedIds = new Set();
  const attempts = [];
  let fail = true;
  context.$emit = (item, meta) => {
    attempts.push(meta.id);
    if (fail && item.Id === "b") {
      throw new Error("publish failed");
    }
    committedIds.add(meta.id);
  };

  await assert.rejects(context.processTimerEvent(WINDOW), /publish failed/);
  assert.deepEqual(writes, []);
  assert.equal(committedIds.size, 1);

  fail = false;
  await context.processTimerEvent(WINDOW);
  assert.deepEqual(attempts.slice(0, 2), attempts.slice(2));
  assert.equal(committedIds.size, 2);
  assert.equal(values.get("latestIdCovered"), "b");
});

test("still advances past a completed batch with no watched field matches", async () => {
  const {
    context, emitted, values,
  } = setup();
  context.query = async () => ({
    records: [],
  });

  await context.processTimerEvent(WINDOW);
  assert.deepEqual(emitted, []);
  assert.equal(values.get("latestIdCovered"), "b");
});
