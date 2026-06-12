import FormData from "form-data";
import emboss from "../../emboss.app.mjs";
import {
  resolveFileRef, writePdf, errorDetail,
} from "../../common/utils.mjs";

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
      const f = await resolveFileRef(this.file, "form.pdf");
      const form = new FormData();
      form.append("file", f.stream, {
        filename: f.filename || "form.pdf",
        contentType: "application/pdf",
        knownLength: f.size,
      });
      const created = await this.emboss.createForm({
        $,
        headers: form.getHeaders(),
        data: form,
        maxBodyLength: Infinity,
      });
      $.flow.rerun(5000, {
        form_id: created.form_id,
      }, 60);
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
      $.flow.rerun(5000, {
        form_id: formId,
      }, 60);
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
