import app from "../../whisper.app.mjs";

export default {
  key: "whisper-graph-submit",
  name: "Graph: Submit Observation / Feedback (whisper.submit)",
  description: "Contribute an indicator observation or feedback back into the graph (requires an API key). The write channel: submit an indicator/feedback with an attributable API key (anonymous submits are refused to preserve K-anonymity). Keyed-only by design. Runs the `submit` graph procedure on the whisper.security graph (keyed - connect your Whisper API key). [See the documentation](https://www.whisper.security/docs/cypher-api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    kind: {
      type: "string",
      label: "Kind",
      description: "The kind the recipe runs against. [Docs](https://www.whisper.security/docs/cypher-api)",
      options: [
        "indicator",
        "feedback",
      ],
      default: "indicator",
    },
    identifierKind: {
      type: "string",
      label: "Identifier Kind",
      description: "The identifier kind the recipe runs against. [Docs](https://www.whisper.security/docs/cypher-api)",
      options: [
        "ip",
        "asn",
        "cert_sha256",
        "cert_ja3_hash",
        "cert_ja4_hash",
        "cert_jarm",
        "cidr",
        "whois_pattern",
        "host_hash_rotating",
        "url_path_hash",
      ],
      default: "ip",
    },
    value: {
      type: "string",
      label: "Value",
      description: "The value the recipe runs against (e.g. `203.0.113.5`, `AS64496`, `198.51.100.0/24`). [Docs](https://www.whisper.security/docs/cypher-api)",
      default: "203.0.113.5",
    },
    observationId: {
      type: "string",
      label: "Observation Id",
      description: "The observation id the recipe runs against. [Docs](https://www.whisper.security/docs/cypher-api)",
      optional: true,
    },
    confidence: {
      type: "string",
      label: "Confidence",
      description: "The confidence the recipe runs against. [Docs](https://www.whisper.security/docs/cypher-api)",
      optional: true,
    },
    firstSeen: {
      type: "string",
      label: "First Seen",
      description: "The first seen the recipe runs against. [Docs](https://www.whisper.security/docs/cypher-api)",
      optional: true,
    },
    provenance: {
      type: "string",
      label: "Provenance",
      description: "The provenance the recipe runs against. [Docs](https://www.whisper.security/docs/cypher-api)",
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "The query the recipe runs against. [Docs](https://www.whisper.security/docs/cypher-api)",
      optional: true,
    },
    results: {
      type: "string",
      label: "Results",
      description: "The results the recipe runs against. [Docs](https://www.whisper.security/docs/cypher-api)",
      optional: true,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "The comment the recipe runs against. [Docs](https://www.whisper.security/docs/cypher-api)",
      optional: true,
    },
    severity: {
      type: "string",
      label: "Severity",
      description: "The severity the recipe runs against. [Docs](https://www.whisper.security/docs/cypher-api)",
      optional: true,
    },
    v: {
      type: "string",
      label: "V",
      description: "The v the recipe runs against. [Docs](https://www.whisper.security/docs/cypher-api)",
      optional: true,
    },
  },
  async run({ $ }) {
    const result = await this.app.runGraphRecipe({
      $,
      id: "submit",
      values: {
        kind: this.kind,
        identifierKind: this.identifierKind,
        value: this.value,
        observationId: this.observationId,
        confidence: this.confidence,
        firstSeen: this.firstSeen,
        provenance: this.provenance,
        query: this.query,
        results: this.results,
        comment: this.comment,
        severity: this.severity,
        v: this.v,
      },
    });
    $.export("$summary", this.app.graphSummary("submit", result));
    return result;
  },
};
