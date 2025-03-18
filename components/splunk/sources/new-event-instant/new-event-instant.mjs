import splunk from "../../splunk.app.mjs";
import crypto from "crypto";

export default {
  key: "splunk-new-event-instant",
  name: "Splunk New Event Instant",
  description: "Emit a new event when a log event is added to a specified Splunk index. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    splunk: {
      type: "app",
      app: "splunk",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    indexName: {
      propDefinition: [
        splunk,
        "indexName",
      ],
    },
    searchFilter: {
      propDefinition: [
        splunk,
        "searchFilter",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const query = `index=${this.indexName} ${this.searchFilter || ""} | head 50 | sort _time asc`;
      const searchJob = await this.splunk.executeSearchQuery({
        query,
        earliestTime: "-24h",
        latestTime: "now",
      });
      const jobId = searchJob.sid;
      await this.db.set("searchJobId", jobId);

      // Poll for search completion
      let jobStatus;
      let attempts = 0;
      const pollInterval = 5000; // 5 seconds
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        jobStatus = await this.splunk.getSearchJobStatus({
          jobId,
        });
        if (jobStatus.entry[0].content.dispatchState === "DONE") {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
        attempts += 1;
      }

      if (jobStatus.entry[0].content.dispatchState !== "DONE") {
        throw new Error("Search job did not complete in time.");
      }

      const results = await this.splunk._makeRequest({
        method: "GET",
        path: `search/jobs/${jobId}/results`,
        params: {
          output_mode: "json",
        },
      });

      const events = results.results;
      for (const event of events) {
        const ts = Date.parse(event._time) || Date.now();
        this.$emit(event, {
          id: event._time,
          summary: `Historical event in index ${this.indexName}`,
          ts,
        });
      }
    },
    async activate() {
      const webhookUrl = this.http.endpoint;
      const searchQuery = `search index=${this.indexName}${
        this.searchFilter
          ? ` ${this.searchFilter}`
          : ""
      }`;

      const alertName = `Pipedream Alert ${Date.now()}`;
      const savedSearch = await this.splunk._makeRequest({
        method: "POST",
        path: "saved/searches",
        data: {
          "name": alertName,
          "search": searchQuery,
          "alert_type": "always",
          "is_scheduled": true,
          "dispatch.earliest_time": "-1m",
          "dispatch.latest_time": "now",
          "alert_actions": "webhook",
          "action.webhook": true,
          "action.webhook_url": webhookUrl,
        },
      });

      const webhookId = savedSearch.entry[0].name;
      await this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.splunk._makeRequest({
          method: "DELETE",
          path: `saved/searches/${encodeURIComponent(webhookId)}`,
        });
        await this.db.delete("webhookId");
      }
    },
  },
  async run(event) {
    const signature = event.headers["X-Splunk-Signature"];
    const secret = this.splunk.$auth.shared_secret;
    const rawBody = event.body;

    if (signature && secret) {
      const computedSignature = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");
      if (computedSignature !== signature) {
        await this.http.respond({
          status: 401,
          body: "Unauthorized",
        });
        return;
      }
    }

    let eventData;
    try {
      eventData = JSON.parse(event.body);
    } catch (error) {
      await this.http.respond({
        status: 400,
        body: "Invalid JSON",
      });
      return;
    }

    // Verify the index
    if (eventData.index !== this.indexName) {
      await this.http.respond({
        status: 200,
        body: "Event does not match the specified index.",
      });
      return;
    }

    // Apply search filter if provided
    if (this.searchFilter) {
      const query = `index=${this.indexName} ${this.searchFilter} | head 1`;
      const searchJob = await this.splunk.executeSearchQuery({
        query,
        earliestTime: "-1m",
        latestTime: "now",
      });
      const jobId = searchJob.sid;

      // Poll for search result
      let jobStatus;
      let attempts = 0;
      const pollInterval = 5000; // 5 seconds
      const maxAttempts = 3;
      let matchedEvent = null;

      while (attempts < maxAttempts) {
        jobStatus = await this.splunk.getSearchJobStatus({
          jobId,
        });
        if (jobStatus.entry[0].content.isDone) {
          const results = jobStatus.entry[0].content.results;
          if (results.length > 0) {
            matchedEvent = results[0];
          }
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
        attempts += 1;
      }

      if (matchedEvent) {
        const ts = Date.parse(matchedEvent._time) || Date.now();
        this.$emit(matchedEvent, {
          id: matchedEvent._time,
          summary: `New event in index ${this.indexName} matching filter`,
          ts,
        });
      }
    } else {
      const ts = Date.parse(eventData._time) || Date.now();
      this.$emit(eventData, {
        id: eventData._time,
        summary: `New event in index ${this.indexName}`,
        ts,
      });
    }

    await this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
