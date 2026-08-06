import FormData from "form-data";
import { ConfigurationError } from "@pipedream/platform";
import emboss from "../../emboss.app.mjs";
import {
  resolveFileRef, writePdf, errorDetail, sleep,
} from "../../common/utils.mjs";

const POLL_DELAY_MS = 5000;
const POLL_TIMEOUT_MS = 12 * 60 * 1000;

export default {
  key: "emboss-create-fillable-form",
  name: "Create Fillable Form",
  description: "Turn a flat (non-fillable) PDF into a fillable form. Emboss detects text fields, checkboxes, signatures, and tables, and returns a fillable PDF plus a form ID. Use **Fill Existing Form** to fill it later, or **Fill PDF From Context** to detect and fill in one step. Polls up to ~12 minutes for large documents. [See the documentation](https://getemboss.ai/docs/reference/create-form)",
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
    const f = await resolveFileRef(this.file, "form.pdf");
    const form = new FormData();
    form.append("file", f.stream, {
      filename: f.filename,
      contentType: "application/pdf",
      knownLength: f.size,
    });
    if (this.callbackUrl) {
      form.append("callback_url", this.callbackUrl);
    }
    const headers = form.getHeaders(this.idempotencyKey
      ? {
        "Idempotency-Key": this.idempotencyKey,
      }
      : undefined);
    const created = await this.emboss.createForm({
      $,
      headers,
      data: form,
      maxBodyLength: Infinity,
    });

    const { form_id: formId } = created;
    const deadline = Date.now() + POLL_TIMEOUT_MS;
    let status = created;
    while (status.status !== "ready") {
      if (status.status === "failed") {
        throw new Error(`Emboss form detection failed: ${errorDetail(status.error)}`);
      }
      if (Date.now() >= deadline) {
        throw new Error(`Emboss form \`${formId}\` is still processing after the polling limit (~12 minutes) — re-run with a smaller PDF or check the job in your Emboss dashboard.`);
      }
      await sleep(POLL_DELAY_MS);
      status = await this.emboss.getForm({
        $,
        formId,
      });
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
