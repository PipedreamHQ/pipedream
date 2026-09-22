import { axios } from "@pipedream/platform";
import { SPORT_TYPES } from "./common/constants.mjs";

export default {
  type: "app",
  app: "strava",
  propDefinitions: {
    activityId: {
      type: "string",
      label: "Activity ID",
      description: "The numeric ID of a Strava activity (e.g., `18522207115`). Use **Search Activities** to resolve an activity name to an ID.",
    },
    sportType: {
      type: "string",
      label: "Sport Type",
      description: "Strava sport type from the modern `sport_type` enum (e.g., `Run`, `Ride`, `Hike`, `Swim`).",
      options: SPORT_TYPES,
    },
    activityDescription: {
      type: "string",
      label: "Description",
      description: "Description text for the activity.",
      optional: true,
    },
    trainer: {
      type: "boolean",
      label: "Trainer",
      description: "Mark as a trainer activity (indoor / stationary).",
      optional: true,
    },
    commute: {
      type: "boolean",
      label: "Commute",
      description: "Mark as a commute.",
      optional: true,
    },
  },
  methods: {
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "user-agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    _getUrl(path) {
      return `https://www.strava.com/api/v3${path}`;
    },
    // Returns the authenticated athlete's ID from the OAuth auth context if
    // Pipedream populates it (verified for some Microsoft Graph apps), or null
    // if not. For Strava specifically, $auth.oauth_uid is not populated, so
    // callers should fall back to getAuthenticatedAthlete() when this returns
    // null.
    _athleteId() {
      const uid = this.$auth?.oauth_uid;
      return uid
        ? String(uid)
        : null;
    },
    // Parse Strava's rate-limit headers. Values are comma-separated
    // `shortTerm,daily` integers. Header names per Strava docs:
    //   X-RateLimit-Limit / X-RateLimit-Usage (overall)
    //   X-ReadRateLimit-Limit / X-ReadRateLimit-Usage (read-only)
    _extractRateLimitUsage(headers = {}) {
      const get = (k) =>
        headers[k] ?? headers[k.toLowerCase()] ?? headers[k.toUpperCase()];
      const parsePair = (val) => {
        if (val == null) return null;
        const parts = String(val).split(",")
          .map((s) => parseInt(s.trim(), 10));
        return {
          shortTerm: Number.isFinite(parts[0])
            ? parts[0]
            : null,
          daily: Number.isFinite(parts[1])
            ? parts[1]
            : null,
        };
      };
      return {
        overall: {
          limit: parsePair(get("x-ratelimit-limit")),
          usage: parsePair(get("x-ratelimit-usage")),
        },
        read: {
          limit: parsePair(get("x-readratelimit-limit")),
          usage: parsePair(get("x-readratelimit-usage")),
        },
      };
    },
    // Strava does NOT return a Retry-After header. Use clock-aligned backoff:
    //   - 15-minute window resets at :00, :15, :30, :45 UTC
    //   - daily window resets at midnight UTC
    // If usage headers indicate the daily limit is hit, wait until midnight
    // UTC (capped at 16 minutes to avoid stalling the action runtime forever).
    // Otherwise default to the next 15-minute boundary.
    _computeBackoffMs(headers = {}) {
      const now = new Date();
      const usage = this._extractRateLimitUsage(headers);
      const dailyUsage = usage.overall?.usage?.daily;
      const dailyLimit = usage.overall?.limit?.daily;
      const MAX_WAIT_MS = 16 * 60 * 1000; // cap at 16 min

      if (dailyUsage != null && dailyLimit != null && dailyUsage >= dailyLimit) {
        const midnight = new Date(now);
        midnight.setUTCHours(24, 0, 0, 0);
        return Math.min(midnight - now + 1000, MAX_WAIT_MS);
      }

      // Next 15-minute boundary on the UTC clock
      const target = new Date(now);
      const nextBoundary = Math.ceil((now.getUTCMinutes() + 1) / 15) * 15;
      target.setUTCMinutes(nextBoundary, 0, 0);
      if (target <= now) {
        target.setUTCMinutes(target.getUTCMinutes() + 15);
      }
      return Math.max(1000, target - now + 1000);
    },
    // On 429, surface a clear, structured error including the wait-until
    // recommendation derived from Strava's clock-aligned reset windows.
    // We do NOT retry in-action: Strava's reset granularity is 15 min, far
    // longer than the MCP / action-runtime 60s timeout. Retrying would block
    // past the timeout and produce an opaque failure. Let the caller (workflow
    // logic or LLM) decide whether to defer — they have the budget we don't.
    _wrap429(err) {
      const status = err?.response?.status;
      if (status !== 429) return err;
      const headers = err?.response?.headers ?? {};
      const usage = this._extractRateLimitUsage(headers);
      const waitMs = this._computeBackoffMs(headers);
      const waitSec = Math.ceil(waitMs / 1000);
      const newErr = new Error(
        `Strava rate limit exceeded (HTTP 429). Strava limits are per-application across all Pipedream users on the shared OAuth client. Recommended wait: ${waitSec}s (until the next clock-aligned reset). Usage at error time: ${JSON.stringify(usage)}.`,
      );
      newErr.code = "STRAVA_RATE_LIMIT_EXCEEDED";
      newErr.retryAfterMs = waitMs;
      newErr._rateLimitUsage = usage;
      newErr.response = err.response;
      return newErr;
    },
    async _makeRequest({
      $,
      path,
      headers,
      ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      try {
        return await axios($ ?? this, config);
      } catch (err) {
        throw this._wrap429(err);
      }
    },
    // Like _makeRequest but returns { data, _rateLimitUsage } so callers can
    // surface Strava's rate-limit headers to end users / LLMs for observability.
    async _requestWithMeta({
      $,
      path,
      headers,
      ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        returnFullResponse: true,
        ...otherConfig,
      };
      let response;
      try {
        response = await axios($ ?? this, config);
      } catch (err) {
        throw this._wrap429(err);
      }
      return {
        data: response?.data,
        _rateLimitUsage: this._extractRateLimitUsage(response?.headers ?? {}),
      };
    },
    async getAuthenticatedAthlete(args = {}) {
      return await this._makeRequest({
        method: "GET",
        path: "/athlete",
        ...args,
      });
    },
    async getActivity({
      activityId,
      ...args
    } = {}) {
      return (
        await this._makeRequest({
          method: "GET",
          path: `/activities/${activityId}`,
          ...args,
        })
      );
    },
    async getStats({
      athleteId,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "GET",
        path: `/athletes/${athleteId}/stats`,
        ...args,
      });
    },
    async createNewActivity(args = {}) {
      return await this._makeRequest({
        method: "POST",
        path: "/activities",
        ...args,
      });
    },
    async updateActivity({
      activityId,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "PUT",
        path: `/activities/${activityId}`,
        ...args,
      });
    },
    async listActivities(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/athlete/activities",
        ...args,
      });
    },
    async getActivityLaps({
      activityId,
      ...args
    } = {}) {
      return this._requestWithMeta({
        method: "GET",
        path: `/activities/${activityId}/laps`,
        ...args,
      });
    },
    async getActivityComments({
      activityId,
      ...args
    } = {}) {
      return this._requestWithMeta({
        method: "GET",
        path: `/activities/${activityId}/comments`,
        ...args,
      });
    },
    async getActivityKudoers({
      activityId,
      ...args
    } = {}) {
      return this._requestWithMeta({
        method: "GET",
        path: `/activities/${activityId}/kudos`,
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      maxItems = 200,
    }) {
      let page = 1;
      let totalCount = 0;
      while (true) {
        const nextResources = await resourceFn({
          ...resourceFnArgs,
          params: {
            ...resourceFnArgs.params,
            page,
          },
        });
        if (!nextResources) {
          throw new Error("No response from Strava API.");
        }
        page += 1;
        for (const resource of nextResources) {
          if (totalCount < maxItems) {
            yield resource;
            totalCount += 1;
          }
        }
        if (!nextResources.length || (maxItems && totalCount >= maxItems)) {
          return;
        }
      }
    },
  },
};
