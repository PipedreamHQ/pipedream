import geogridapi from "../../geogridapi.app.mjs";
import {
  DEFAULT_MAX_WAIT_SECONDS,
  FINISHED_STATUSES,
  POLL_INTERVAL_MS,
} from "../../common/constants.mjs";
import {
  buildGridBody,
  gridSummary,
  sleep,
} from "../../common/utils.mjs";

export default {
  key: "geogridapi-run-grid",
  name: "Run Grid",
  description: "Measure where a Google Business Profile ranks on Google Maps for a keyword at every point of a grid around it (geo-grid rank tracking)."
    + " Returns the rank matrix (`ranks`, row 0 = north, lower is better, `null` = not in the top 20), the `summary` (average rank, points in the top 3), the `competitors` ranking ahead and the change since the previous grid (`previous`)."
    + " Costs 1 credit per grid point (square 3×3 = 9, 7×7 = 49, 9×9 = 81; points at sea are free), refunded if the grid fails: use **Estimate Grid** first when the budget matters."
    + " Identify the listing with **Place ID** (from **Find Business**) or with **Business Name and City**."
    + " A grid takes 20 seconds to 2 minutes: the step waits up to **Max Wait (seconds)** (25 by default, within the default workflow timeout) and otherwise returns the grid with its `id` and status `pending` or `running`; read the result later with **Get Grid**, or raise both the workflow timeout and **Max Wait (seconds)**."
    + " Set **Idempotency Key** when the step may be retried, so a retry never runs or charges the grid twice."
    + " [See the documentation](https://geogridapi.io/en/docs#create)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    geogridapi,
    placeId: {
      propDefinition: [
        geogridapi,
        "placeId",
      ],
    },
    query: {
      propDefinition: [
        geogridapi,
        "query",
      ],
    },
    keyword: {
      propDefinition: [
        geogridapi,
        "keyword",
      ],
    },
    shape: {
      propDefinition: [
        geogridapi,
        "shape",
      ],
    },
    size: {
      propDefinition: [
        geogridapi,
        "size",
      ],
    },
    density: {
      propDefinition: [
        geogridapi,
        "density",
      ],
    },
    radiusKm: {
      propDefinition: [
        geogridapi,
        "radiusKm",
      ],
    },
    language: {
      propDefinition: [
        geogridapi,
        "language",
      ],
    },
    country: {
      propDefinition: [
        geogridapi,
        "country",
      ],
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "Public HTTPS URL that receives the finished grid (`grid.completed` or `grid.failed` event), e.g. `https://eo123.m.pipedream.net`. Optional.",
      optional: true,
    },
    idempotencyKey: {
      type: "string",
      label: "Idempotency Key",
      description: "Any unique string for this grid, e.g. `{{steps.trigger.context.trace_id}}` (unchanged when Pipedream auto-retries the workflow). The same key returns the grid already created instead of running and charging a new one. Optional.",
      optional: true,
    },
    waitForCompletion: {
      type: "boolean",
      label: "Wait for Completion",
      description: "Whether to wait for the finished grid before returning, e.g. `true`. When `false`, the step returns the grid with status `pending` at once. Defaults to `true`.",
      optional: true,
      default: true,
    },
    maxWaitSeconds: {
      type: "integer",
      label: "Max Wait (seconds)",
      description: "How long to wait for the result when **Wait for Completion** is on, e.g. `25`. Keep it below the workflow timeout (30 seconds by default for HTTP triggers). If the grid is still running after that, the step returns it with its current status. Defaults to `25`.",
      optional: true,
      default: DEFAULT_MAX_WAIT_SECONDS,
      min: 5,
      max: 740,
    },
  },
  async run({ $ }) {
    let grid = await this.geogridapi.createGrid({
      $,
      idempotencyKey: this.idempotencyKey,
      data: {
        ...buildGridBody(this),
        webhook_url: this.webhookUrl,
      },
    });

    if (this.waitForCompletion !== false) {
      const deadline = Date.now() + (this.maxWaitSeconds ?? DEFAULT_MAX_WAIT_SECONDS) * 1000;
      while (!FINISHED_STATUSES.includes(grid.status) && Date.now() + POLL_INTERVAL_MS <= deadline) {
        await sleep(POLL_INTERVAL_MS);
        try {
          grid = await this.geogridapi.getGrid({
            $,
            gridId: grid.id,
          });
        } catch {
          // The grid exists and is paid for: return it with its ID rather than failing the step.
          break;
        }
      }
    }

    $.export("$summary", gridSummary(grid));
    return grid;
  },
};
