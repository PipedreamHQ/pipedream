// x-pd-ai: optimized
import FormData from "form-data";
import { ConfigurationError } from "@pipedream/platform";
import emboss from "../../emboss.app.mjs";
import {
  resolveFileRef, contextParts, writePdf, pollUntilReady,
} from "../../common/utils.mjs";

export default {
  key: "emboss-fill-from-pdf-context",
  name: "Fill PDF From Context",
  description: "Upload a flat (non-fillable) PDF plus context (text and/or a file); Emboss detects the fields and fills them with AI in one step, returning the completed PDF. Provide at least one context input. Use **Create Fillable Form** + **Fill Existing Form** instead to reuse the same form repeatedly. Polls up to ~12 minutes for large documents. [See the documentation](https://getemboss.ai/docs/reference/fill-with-context)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    emboss,
    file: {
      propDefinition: [
        emboss,
        "file",
      ],
    },
    contextText: {
      propDefinition: [
        emboss,
        "contextText",
      ],
    },
    contextFile: {
      propDefinition: [
        emboss,
        "contextFile",
      ],
    },
    idempotencyKey: {
      propDefinition: [
        emboss,
        "idempotencyKey",
      ],
    },
    callbackUrl: {
      propDefinition: [
        emboss,
        "callbackUrl",
      ],
    },
    syncDir: {
      propDefinition: [
        emboss,
        "syncDir",
      ],
    },
  },
  async run({ $ }) {
    if (!this.file) {
      throw new ConfigurationError("File Path Or Url is required.");
    }
    if (!this.contextText && !this.contextFile) {
      throw new ConfigurationError("Provide Context (Text) and/or a Context File — at least one is required to fill the form.");
    }
    const f = await resolveFileRef(this.file, "form.pdf");
    const cf = await resolveFileRef(this.contextFile, "context");
    const form = new FormData();
    form.append("file", f.stream, {
      filename: f.filename,
      contentType: "application/pdf",
      knownLength: f.size,
    });
    for (const p of contextParts(this.contextText, cf)) {
      form.append("context", p.value, {
        filename: p.filename,
        contentType: p.contentType,
        knownLength: p.knownLength,
      });
    }
    if (this.callbackUrl) {
      form.append("callback_url", this.callbackUrl);
    }
    const headers = form.getHeaders(this.idempotencyKey
      ? {
        "Idempotency-Key": this.idempotencyKey,
      }
      : undefined);
    const created = await this.emboss.createFormWithContext({
      $,
      headers,
      data: form,
      maxBodyLength: Infinity,
    });

    const { job_id: jobId } = created;
    const status = await pollUntilReady({
      initial: created,
      getStatus: () => this.emboss.getContextJob({
        $,
        jobId,
      }),
      failedPrefix: "Emboss fill failed",
      timeoutMessage: "Emboss job still processing after the polling limit (~12 minutes) — re-run with a smaller PDF or check the job in your Emboss dashboard.",
    });

    const pdf = await this.emboss.getSessionPdf({
      $,
      sessionId: status.session_id,
    });
    const { filepath } = await writePdf(Buffer.from(pdf), `emboss-${status.session_id}.pdf`);
    $.export("$summary", `Successfully filled form (session \`${status.session_id}\`)`);
    return {
      session_id: status.session_id,
      report: status.report || {},
      filepath,
    };
  },
};
