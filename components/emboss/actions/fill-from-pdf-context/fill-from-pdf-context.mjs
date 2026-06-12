import FormData from "form-data";
import { ConfigurationError } from "@pipedream/platform";
import emboss from "../../emboss.app.mjs";
import {
  resolveFileRef, contextParts, writePdf, errorDetail,
} from "../../common/utils.mjs";

const POLL_DELAY_MS = 5000;
const MAX_RETRIES = 60;

export default {
  key: "emboss-fill-from-pdf-context",
  name: "Fill PDF From Context",
  description: "Upload a flat PDF plus context (text and/or a file); Emboss detects the fields and fills them. [See the documentation](https://getemboss.ai/docs)",
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
      type: "string",
      label: "File Path Or Url",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/form.pdf`).",
      format: "file-ref",
    },
    contextText: {
      type: "string",
      label: "Context (Text)",
      description: "Information to fill the form with.",
      optional: true,
    },
    contextFile: {
      type: "string",
      label: "Context File",
      description: "A URL or `/tmp` path to a context document (PDF, DOCX, CSV, image, or text).",
      format: "file-ref",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read-write",
      sync: true,
    },
  },
  async run({ $ }) {
    const {
      runs, context,
    } = $.context.run;
    if (runs === 1) {
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
      const created = await this.emboss.createWithContext({
        $,
        headers: form.getHeaders(),
        data: form,
        maxBodyLength: Infinity,
      });
      $.flow.rerun(POLL_DELAY_MS, {
        job_id: created.job_id,
      }, MAX_RETRIES);
      return;
    }
    const { job_id: jobId } = context;
    const status = await this.emboss.getContextJob({
      $,
      jobId,
    });
    if (status.status === "failed") {
      throw new Error(`Emboss fill failed: ${errorDetail(status.error)}`);
    }
    if (status.status !== "ready") {
      if (runs >= MAX_RETRIES) {
        throw new Error("Emboss job still processing after the polling limit (~5 minutes) — re-run with a smaller PDF or check the job in your Emboss dashboard.");
      }
      $.flow.rerun(POLL_DELAY_MS, {
        job_id: jobId,
      }, MAX_RETRIES);
      return;
    }
    await this.emboss.fillSession({
      $,
      sessionId: status.session_id,
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
