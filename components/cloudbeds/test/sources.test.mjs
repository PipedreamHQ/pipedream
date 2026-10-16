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
    assert.ok(emissions[0].meta.id.includes(body.reservationId));
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

test("successive date changes retain distinct event IDs", () => {
  const body = datesChanged.sampleEmit;
  assert.notEqual(datesChanged.methods.generateMeta(body).id, datesChanged.methods.generateMeta({
    ...body,
    timestamp: body.timestamp + 1,
  }).id);
});
