import FormData from "form-data";
import emboss from "../../emboss.app.mjs";
import {
  resolveFileRef, contextParts, writePdf, errorDetail,
} from "../../common/utils.mjs";

export default {
  key: "emboss-fill-existing-form",
  name: "Fill Existing Form",
  description: "Fill a form you already created in Emboss, from context. [See the documentation](https://getemboss.ai/docs)",
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
      type: "string",
      label: "Context (Text)",
      description: "Information to fill the form with.",
      optional: true,
    },
    contextFile: {
      type: "string",
      label: "Context File",
      description: "A URL or `/tmp` path to a context document.",
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
      const cf = await resolveFileRef(this.contextFile, "context");
      const form = new FormData();
      for (const p of contextParts(this.contextText, cf)) {
        form.append("context", p.value, {
          filename: p.filename,
          contentType: p.contentType,
          knownLength: p.knownLength,
        });
      }
      const created = await this.emboss.fillExistingForm({
        $,
        formId: this.formId,
        headers: form.getHeaders(),
        data: form,
        maxBodyLength: Infinity,
      });
      $.flow.rerun(5000, {
        job_id: created.job_id,
      }, 60);
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
      $.flow.rerun(5000, {
        job_id: jobId,
      }, 60);
      return;
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
