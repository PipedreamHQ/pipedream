import FormData from "form-data";
import { ConfigurationError } from "@pipedream/platform";
import emboss from "../../emboss.app.mjs";
import {
  resolveFileRef, contextParts, writePdf, errorDetail, sleep,
} from "../../common/utils.mjs";

const POLL_DELAY_MS = 5000;
const POLL_TIMEOUT_MS = 12 * 60 * 1000;

export default {
  key: "emboss-fill-existing-form",
  name: "Fill Existing Form",
  description: "Fill a form you previously created in Emboss, using context text and/or a context file; Emboss populates the detected fields from your context and returns the completed PDF. Create the form first with **Create Fillable Form**. Provide at least one context input. Polls up to ~12 minutes. [See the documentation](https://getemboss.ai/docs/reference/fill-with-context)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    emboss,
    formId: {
      propDefinition: [
        emboss,
        "formId",
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
    if (!this.contextText && !this.contextFile) {
      throw new ConfigurationError("Provide Context (Text) and/or a Context File — at least one is required to fill the form.");
    }
    const cf = await resolveFileRef(this.contextFile, "context");
    const form = new FormData();
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
    const created = await this.emboss.fillExistingForm({
      $,
      formId: this.formId,
      headers,
      data: form,
      maxBodyLength: Infinity,
    });

    const { job_id: jobId } = created;
    const deadline = Date.now() + POLL_TIMEOUT_MS;
    let status = created;
    while (status.status !== "ready") {
      if (status.status === "failed") {
        throw new Error(`Emboss fill failed: ${errorDetail(status.error)}`);
      }
      if (Date.now() >= deadline) {
        throw new Error("Emboss job still processing after the polling limit (~12 minutes) — re-run with a smaller PDF or check the job in your Emboss dashboard.");
      }
      await sleep(POLL_DELAY_MS);
      status = await this.emboss.getContextJob({
        $,
        jobId,
      });
    }

    const pdf = await this.emboss.getSessionPdf({
      $,
      sessionId: status.session_id,
    });
    const { filepath } = await writePdf(Buffer.from(pdf), `emboss-${status.session_id}.pdf`);
    $.export("$summary", `Successfully filled form \`${this.formId}\` (session \`${status.session_id}\`)`);
    return {
      session_id: status.session_id,
      report: status.report || {},
      filepath,
    };
  },
};
