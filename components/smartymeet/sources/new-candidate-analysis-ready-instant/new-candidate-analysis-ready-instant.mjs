import smartymeet from "../../smartymeet.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "smartymeet-new-candidate-analysis-ready-instant",
  name: "New Candidate Analysis Ready (Instant)",
  description: "Emit new event every time a new candidate's analysis report becomes available. [See the documentation](https://docs.smartymeet.com/smartymeet_versioned/smartymeet-api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    smartymeet: {
      type: "app",
      app: "smartymeet",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    candidateId: {
      propDefinition: [
        smartymeet,
        "candidateId",
      ],
    },
    reportType: {
      propDefinition: [
        smartymeet,
        "reportType",
        {
          optional: true,
        },
      ],
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  hooks: {
    async deploy() {
      const analyses = await this.smartymeet.retrieveCandidateAnalysis({
        candidateId: this.candidateId,
        analysisType: this.reportType,
      });
      for (const analysis of analyses) {
        this.$emit(analysis, {
          id: analysis.id,
          summary: `New analysis report for candidate ${analysis.candidateId}`,
          ts: Date.parse(analysis.createdAt),
        });
      }
    },
    async activate() {
      const webhookSecret = crypto.randomBytes(16).toString("hex");
      this.db.set("webhookSecret", webhookSecret);

      const webhookId = await this.smartymeet.emitNewCandidateAnalysisReport({
        candidateId: this.candidateId,
        reportType: this.reportType,
      });
      this._setWebhookId(webhookId);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.smartymeet._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
      }
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;
    const webhookSecret = this.db.get("webhookSecret");
    const computedSignature = crypto.createHmac("sha256", webhookSecret).update(body)
      .digest("hex");

    if (headers["x-smartymeet-signature"] !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: "OK",
    });

    const analysisReport = JSON.parse(body);
    this.$emit(analysisReport, {
      id: analysisReport.id,
      summary: `New analysis report for candidate ${analysisReport.candidateId}`,
      ts: Date.parse(analysisReport.createdAt),
    });
  },
};
