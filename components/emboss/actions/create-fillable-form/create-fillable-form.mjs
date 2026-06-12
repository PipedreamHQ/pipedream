import FormData from "form-data";
import { ConfigurationError } from "@pipedream/platform";
import emboss from "../../emboss.app.mjs";
import {
  resolveFileRef, writePdf, errorDetail,
} from "../../common/utils.mjs";

const POLL_DELAY_MS = 5000;
const MAX_RETRIES = 60;

export default {
  key: "emboss-create-fillable-form",
  name: "Create Fillable Form",
  description: "Turn a flat PDF into a fillable form. [See the documentation](https://getemboss.ai/docs)",
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
      const f = await resolveFileRef(this.file, "form.pdf");
      const form = new FormData();
      form.append("file", f.stream, {
        filename: f.filename,
        contentType: "application/pdf",
        knownLength: f.size,
      });
      const created = await this.emboss.createForm({
        $,
        headers: form.getHeaders(),
        data: form,
        maxBodyLength: Infinity,
      });
      $.flow.rerun(POLL_DELAY_MS, {
        form_id: created.form_id,
      }, MAX_RETRIES);
      return;
    }
    const { form_id: formId } = context;
    const status = await this.emboss.getForm({
      $,
      formId,
    });
    if (status.status === "failed") {
      throw new Error(`Emboss create failed: ${errorDetail(status.error)}`);
    }
    if (status.status !== "ready") {
      if (runs >= MAX_RETRIES) {
        throw new Error("Emboss job still processing after the polling limit (~5 minutes) — re-run with a smaller PDF or check the job in your Emboss dashboard.");
      }
      $.flow.rerun(POLL_DELAY_MS, {
        form_id: formId,
      }, MAX_RETRIES);
      return;
    }
    const pdf = await this.emboss.getFillablePdf({
      $,
      formId,
    });
    const { filepath } = await writePdf(Buffer.from(pdf), `emboss-${formId}.pdf`);
    $.export("$summary", `Successfully created fillable form \`${formId}\``);
    return {
      form_id: formId,
      status: "ready",
      filepath,
    };
  },
};
