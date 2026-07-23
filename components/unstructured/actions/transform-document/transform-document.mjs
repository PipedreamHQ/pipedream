import fs from "node:fs/promises";
import path from "node:path";
import {
  assertWithinBufferLimit,
  buildStages,
  JOB_TIMEOUT_MS,
  MAX_BUFFER_BYTES,
  RESULTS_RETRY_MS,
  streamToBuffer,
  TERMINAL_STATUSES,
  withTransferTimeout,
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
  description: "Convert PDFs, DOCX, PPTX, HTML, and images, including scanned pages via OCR, into clean Markdown, JSON, HTML, or text. Optionally enrich, chunk, and embed the result for RAG. Supports files and inline results up to 50 MB. [See the documentation](https://docs.unstructured.io/transform/quickstart)",
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
      description: "A public file URL or a path to a file in the `/tmp` directory, for example `/tmp/report.pdf`. Files can be up to 50 MB",
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
    if (metadata.size != null) {
      assertWithinBufferLimit(metadata.size, {
        label: "Source file",
      });
    }
    const source = await streamToBuffer(stream, {
      label: "Source file",
    });
    const sourceName = metadata.name || path.basename(this.file) || "document";
    const contentType = metadata.contentType || "application/octet-stream";
    const stages = buildStages(this);

    const upload = await this.unstructured.requestTransformUpload({
      filename: sourceName,
      content_type: contentType,
      size_bytes: source.length,
    });
    const uploadResponse = await withTransferTimeout((signal) =>
      fetch(upload.upload_url, {
        method: "PUT",
        headers: upload.headers || {},
        body: source,
        signal,
      }));
    if (!uploadResponse.ok) {
      throw new Error(`Transform upload failed (${uploadResponse.status})`);
    }

    const job = await this.unstructured.startTransformJob({
      file_refs: [
        upload.file_ref,
      ],
      stages,
    });

    const deadline = Date.now() + JOB_TIMEOUT_MS;
    let status;
    while (Date.now() < deadline) {
      status = await this.unstructured.checkTransformJobStatus({
        job_id: job.job_id,
      });
      if (TERMINAL_STATUSES.has(status.status)) break;
      const remainingMs = deadline - Date.now();
      if (remainingMs <= 0) break;
      const pollAfterMs = Math.max(Number(status.poll_after) || 30, 1) * 1000;
      await new Promise((resolve) => setTimeout(
        resolve,
        Math.min(pollAfterMs, remainingMs),
      ));
    }
    if (!status || !TERMINAL_STATUSES.has(status.status)) {
      throw new Error(`Transform job ${job.job_id} did not finish within 10 minutes`);
    }
    if (status.status !== "COMPLETED") {
      throw new Error(`Transform job ${job.job_id} ended with ${status.status}`);
    }

    let results;
    while (!results) {
      try {
        results = await this.unstructured.getTransformJobResults({
          job_id: job.job_id,
          output_format: this.outputFormat,
          ...(this.outputFormat === "json"
            ? {
              image_base64: "none",
            }
            : {}),
        });
      } catch (error) {
        if (error.code !== "job_not_complete") throw error;
        const remainingMs = deadline - Date.now();
        if (remainingMs <= 0) {
          throw new Error(`Transform job ${job.job_id} results were not ready within 10 minutes`);
        }
        await new Promise((resolve) => setTimeout(
          resolve,
          Math.min(RESULTS_RETRY_MS, remainingMs),
        ));
      }
    }

    const result = results.files?.[0];
    if (!result) {
      throw new Error(`Transform job ${job.job_id} returned no result files`);
    }
    const resultLabel = result.output_ref
      ? `Transform result for job ${job.job_id} (${result.output_ref})`
      : `Transform result for job ${job.job_id}`;

    let output;
    if (result.content !== undefined) {
      output = Buffer.from(result.content);
      assertWithinBufferLimit(output.length, {
        label: resultLabel,
      });
    } else {
      output = await withTransferTimeout(async (signal) => {
        const downloadResponse = await fetch(result.download_url, {
          signal,
        });
        if (!downloadResponse.ok) {
          throw new Error(`Transform result download failed (${downloadResponse.status})`);
        }
        if (!downloadResponse.body) {
          throw new Error(`Transform job ${job.job_id} returned an empty result download`);
        }
        const contentLength = Number(downloadResponse.headers.get("content-length"));
        if (Number.isFinite(contentLength)) {
          assertWithinBufferLimit(contentLength, {
            label: resultLabel,
          });
        }
        return streamToBuffer(downloadResponse.body, {
          label: resultLabel,
          maxBytes: MAX_BUFFER_BYTES,
        });
      });
    }

    const format = OUTPUT_FORMATS[this.outputFormat];
    const outputName = `${path.parse(sourceName).name}${format.extension}`;
    const outputDir = process.env.STASH_DIR || "/tmp";
    const outputPath = path.join(outputDir, outputName);
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
  },
};
