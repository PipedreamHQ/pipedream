import fs from "node:fs/promises";
import path from "node:path";
import {
  buildStages,
  streamToBuffer,
  TERMINAL_STATUSES,
} from "../../common/transform.mjs";
import unstructured from "../../unstructured.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

const OUTPUT_FORMATS = {
  md: {
    extension: ".md",
    mimeType: "text/markdown",
  },
  json: {
    extension: ".json",
    mimeType: "application/json",
  },
  html: {
    extension: ".html",
    mimeType: "text/html",
  },
  txt: {
    extension: ".txt",
    mimeType: "text/plain",
  },
};

export default {
  key: "unstructured-transform-document",
  name: "Transform Document",
  description: "Convert PDFs, DOCX, PPTX, HTML, and images, including scanned pages via OCR, into clean Markdown, JSON, HTML, or text. Optionally enrich, chunk, and embed the result for RAG. [See the documentation](https://docs.unstructured.io/transform/quickstart)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    unstructured,
    file: {
      type: "string",
      label: "File Path or URL",
      description: "A public file URL or a path to a file in the `/tmp` directory, for example `/tmp/report.pdf`",
      format: "file-ref",
    },
    outputFormat: {
      type: "string",
      label: "Output Format",
      description: "Use Markdown for LLM context or JSON for structured downstream processing",
      options: [
        {
          label: "Markdown",
          value: "md",
        },
        {
          label: "JSON",
          value: "json",
        },
        {
          label: "HTML",
          value: "html",
        },
        {
          label: "Plain Text",
          value: "txt",
        },
      ],
      default: "md",
    },
    strategy: {
      type: "string",
      label: "Parsing Strategy",
      description: "Use `hi_res` for enrichments and scanned or layout-heavy documents",
      options: [
        "auto",
        "fast",
        "hi_res",
        "vlm",
      ],
      default: "auto",
      optional: true,
    },
    languages: {
      type: "string[]",
      label: "Languages",
      description: "Optional language codes used for parsing and OCR, for example `eng` or `spa`",
      optional: true,
    },
    enrichments: {
      type: "string[]",
      label: "Enrichments",
      description: "Optional post-processing to apply to the parsed elements. Enrichments work best with `hi_res`",
      options: [
        "image_description",
        "table_description",
        "table_to_html",
        "ner",
        "generative_ocr",
      ],
      optional: true,
    },
    chunkingStrategy: {
      type: "string",
      label: "Chunking Strategy",
      description: "Optionally split the transformed elements into retrieval-sized chunks",
      options: [
        "chunk_by_title",
        "chunk_by_character",
        "chunk_by_page",
        "chunk_by_similarity",
      ],
      optional: true,
    },
    maxCharacters: {
      type: "integer",
      label: "Maximum Characters per Chunk",
      description: "Maximum chunk size when a chunking strategy is selected",
      default: 800,
      min: 1,
      optional: true,
    },
    generateEmbeddings: {
      type: "boolean",
      label: "Generate Embeddings",
      description: "Attach embeddings for RAG. Best used with a chunking strategy",
      default: false,
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read+write",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      stream,
      metadata,
    } = await getFileStreamAndMetadata(this.file);
    const source = await streamToBuffer(stream);
    const sourceName = metadata.name || path.basename(this.file) || "document";
    const contentType = metadata.contentType || "application/octet-stream";
    const stages = buildStages(this);

    return this.unstructured.withTransformClient(async (client) => {
      const upload = await this.unstructured.callTransformTool(
        client,
        "request_file_upload_url",
        {
          filename: sourceName,
          content_type: contentType,
          size_bytes: source.length,
        },
      );
      const uploadResponse = await fetch(upload.upload_url, {
        method: "PUT",
        headers: upload.headers || {},
        body: source,
      });
      if (!uploadResponse.ok) {
        throw new Error(`Transform upload failed (${uploadResponse.status})`);
      }

      const job = await this.unstructured.callTransformTool(
        client,
        "transform_files",
        {
          file_refs: [
            upload.file_ref,
          ],
          stages,
        },
      );

      let status;
      for (let attempt = 0; attempt < 20; attempt += 1) {
        status = await this.unstructured.callTransformTool(
          client,
          "check_transform_status",
          {
            job_id: job.job_id,
          },
        );
        if (TERMINAL_STATUSES.has(status.status)) break;
        await new Promise((resolve) => setTimeout(
          resolve,
          (status.poll_after || 30) * 1000,
        ));
      }
      if (!status || !TERMINAL_STATUSES.has(status.status)) {
        throw new Error(`Transform job ${job.job_id} did not finish within 10 minutes`);
      }
      if (status.status !== "COMPLETED") {
        throw new Error(`Transform job ${job.job_id} ended with ${status.status}`);
      }

      const results = await this.unstructured.callTransformTool(
        client,
        "get_transform_results",
        {
          job_id: job.job_id,
          output_format: this.outputFormat,
        },
      );
      const result = results.files[0];
      let output;
      if (result.content !== undefined) {
        output = Buffer.from(result.content);
      } else {
        const downloadResponse = await fetch(result.download_url);
        if (!downloadResponse.ok) {
          throw new Error(`Transform result download failed (${downloadResponse.status})`);
        }
        output = Buffer.from(await downloadResponse.arrayBuffer());
      }

      const format = OUTPUT_FORMATS[this.outputFormat];
      const outputName = `${path.parse(sourceName).name}${format.extension}`;
      const outputPath = path.join("/tmp", outputName);
      await fs.writeFile(outputPath, output);
      const content = output.toString("utf8");

      $.export("$summary", `Transformed ${sourceName} to ${this.outputFormat}`);
      return {
        jobId: job.job_id,
        status: status.status,
        outputFormat: this.outputFormat,
        outputRef: result.output_ref,
        outputFile: outputPath,
        mimeType: format.mimeType,
        content: this.outputFormat === "json"
          ? JSON.parse(content)
          : content,
      };
    });
  },
};
