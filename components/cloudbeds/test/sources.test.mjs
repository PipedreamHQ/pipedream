import assert from "node:assert/strict";
import { test } from "node:test";
import datesChanged from "../sources/reservation-dates-changed/reservation-dates-changed.mjs";
import deleted from "../sources/reservation-deleted/reservation-deleted.mjs";

for (const source of [
  datesChanged,
  deleted,
]) {
  test(source.key, async () => {
    const subscriptions = [];
    const deletions = [];
    const responses = [];
    const emissions = [];
    const context = {
      ...source.methods,
      db: new Map(),
      http: {
        endpoint: "https://example.com/cloudbeds",
        respond: (response) => responses.push(response),
      },
      cloudbeds: {
        async createWebhook(request) {
          subscriptions.push(request);
          return {
            data: {
              subscriptionID: "test-subscription",
            },
          };
        },
        async deleteWebhook(request) {
          deletions.push(request);
        },
      },
      $emit: (body, meta) => emissions.push({
        body,
        meta,
      }),
    };
    await source.hooks.deactivate.call(context);
    assert.equal(deletions.length, 0);
    await source.hooks.activate.call(context);
    assert.deepEqual(subscriptions[0], {
      data: {
        endpointUrl: context.http.endpoint,
        object: "reservation",
        action: source.sampleEmit.event.split("/")[1],
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    assert.equal(context.db.get("webhookId"), "test-subscription");
    const body = source.sampleEmit;
    await source.run.call(context, {
      body,
    });
    assert.equal(responses[0].status, 200);
    assert.equal(emissions.length, 1);
    assert.strictEqual(emissions[0].body, body);
    assert.equal(emissions[0].meta.ts, 1789459200431);
    assert.equal(typeof emissions[0].meta.id, "string");
    assert.ok(emissions[0].meta.id.length > 0 && emissions[0].meta.id.length <= 64);
    assert.equal(source.dedupe, "unique");
    assert.deepEqual(source.methods.generateMeta(body), emissions[0].meta);
    assert.notEqual(source.methods.generateMeta({
      ...body,
      reservationId: "31415927",
    }).id, emissions[0].meta.id);
    await source.hooks.deactivate.call(context);
    assert.deepEqual(deletions, [
      {
        params: {
          subscriptionID: "test-subscription",
        },
      },
    ]);
  });
}

for (const reservationId of [
  datesChanged.sampleEmit.reservationId,
  "1234567890".repeat(8),
]) {
  test(`date-change IDs are bounded, stable and event-specific for ${reservationId.length}-character reservation IDs`, () => {
    const body = {
      ...datesChanged.sampleEmit,
      reservationId,
    };
    const { id } = datesChanged.methods.generateMeta(body);
    assert.ok(id.length > 0 && id.length <= 64);
    assert.equal(datesChanged.methods.generateMeta({
      ...body,
    }).id, id);
    assert.notEqual(datesChanged.methods.generateMeta({
      ...body,
      reservationId: `${reservationId}1`,
    }).id, id);
    assert.notEqual(datesChanged.methods.generateMeta({
      ...body,
      timestamp: body.timestamp + 0.000001,
    }).id, id);
  });
}

test("date-change IDs distinguish changed dates at the same timestamp", () => {
  const body = datesChanged.sampleEmit;
  const { id } = datesChanged.methods.generateMeta(body);
  for (const change of [
    {
      startDate: "2026-10-09",
    },
    {
      endDate: "2026-10-13",
    },
    {
      subReservations: [
        {
          ...body.subReservations[0],
          startDate: "2026-10-09",
        },
      ],
    },
    {
      subReservations: [
        {
          ...body.subReservations[0],
          endDate: "2026-10-13",
        },
      ],
    },
    {
      subReservations: [
        {
          ...body.subReservations[0],
          id: "31415926-2",
        },
      ],
    },
  ]) {
    assert.notEqual(datesChanged.methods.generateMeta({
      ...body,
      ...change,
    }).id, id);
  }
});

test("date-change retries retain their ID when sub-reservations are reordered", () => {
  const body = {
    ...datesChanged.sampleEmit,
    subReservations: [
      {
        id: "31415926-1",
        startDate: "2026-10-10",
        endDate: "2026-10-12",
      },
      {
        id: "31415926-2",
        startDate: "2026-10-11",
        endDate: "2026-10-13",
      },
    ],
  };
  const retry = {
    ...body,
    subReservations: body.subReservations.map((reservation) => ({
      endDate: reservation.endDate,
      startDate: reservation.startDate,
      id: reservation.id,
    })).reverse(),
  };
  assert.equal(datesChanged.methods.generateMeta(retry).id,
    datesChanged.methods.generateMeta(body).id);
});
