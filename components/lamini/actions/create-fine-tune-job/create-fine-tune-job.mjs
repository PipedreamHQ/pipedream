import app from "../../lamini.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "lamini-create-fine-tune-job",
  name: "Create Fine-Tune Job",
  description: "Create a fine-tuning job with a dataset. [See the documentation](https://docs.lamini.ai/api/).",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    modelName: {
      description: "Base model to be fine-tuned.",
      propDefinition: [
        app,
        "modelName",
        () => ({
          includeFineTunedModels: false,
        }),
      ],
    },
    datasetId: {
      type: "string",
      label: "Dataset ID",
      description: "Previously uploaded dataset to use for training. Please use the **Upload Dataset** action to upload a dataset.",
    },
    fineTuneArgs: {
      type: "object",
      label: "Finetune Arguments",
      description: "Optional hyperparameters for fine-tuning. Each property is optional:\n- `index_pq_m`: Number of subquantizers for PQ (eg. 8)\n- `index_max_size`: Maximum index size (eg. 65536)\n- `max_steps`: Maximum number of training steps (eg. 60)\n- `batch_size`: Training batch size (eg. 1)\n- `learning_rate`: Learning rate (eg. 0.0003)\n- `index_pq_nbits`: Number of bits per subquantizer (eg. 8)\n- `max_length`: Maximum sequence length (eg. 2048)\n- `index_ivf_nlist`: Number of IVF lists (eg. 2048)\n- `save_steps`: Steps between checkpoints (eg. 60)\n- `args_name`: Name for the argument set (eg. \"demo\")\n- `r_value`: R value for LoRA (eg. 32)\n- `index_hnsw_m`: Number of neighbors in HNSW (eg. 32)\n- `index_method`: Indexing method (eg. \"IndexIVFPQ\")\n- `optim`: Optimizer to use (eg. \"adafactor\")\n- `index_hnsw_efConstruction`: HNSW construction parameter (eg. 16)\n- `index_hnsw_efSearch`: HNSW search parameter (eg. 8)\n- `index_k`: Number of nearest neighbors (eg. 2)\n- `index_ivf_nprobe`: Number of IVF probes (eg. 48)\n- `eval_steps`: Steps between evaluations (eg. 30)\n[See the documentation](https://docs.lamini.ai/tuning/hyperparameters/#finetune_args).",
      optional: true,
    },
    gpuConfig: {
      type: "object",
      label: "GPU Config",
      description: "Optional GPU configuration for fine-tuning. [See the documentation](https://docs.lamini.ai/tuning/hyperparameters/#gpu_config).",
      optional: true,
    },
    isPublic: {
      type: "boolean",
      label: "Is Public",
      description: "Whether this fine-tuning job and dataset should be publicly accessible.",
      optional: true,
    },
    customModelName: {
      type: "string",
      label: "Custom Model Name",
      description: "A human-readable name for the fine-tuned model.",
      optional: true,
    },
    waitForCompletion: {
      type: "boolean",
      label: "Wait for Completion",
      description: "If set to `true`, the action will wait and poll until the fine-tuning job is `COMPLETED`. If is set to `false`, it will return immediately after creating the job. Not available in Pipedream Connect.",
      default: false,
      optional: true,
    },
  },
  methods: {
    createFineTuneJob(args = {}) {
      return this.app.post({
        versionPath: constants.VERSION_PATH.V1,
        path: "/train",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      app,
      createFineTuneJob,
      modelName,
      datasetId,
      fineTuneArgs,
      gpuConfig,
      isPublic,
      customModelName,
      waitForCompletion,
    } = this;

    const MAX_RETRIES = 15;
    const DELAY = 1000 * 30; // 30 seconds
    const context = $.context;
    const run = context
      ? context.run
      : {
        runs: 1,
      };

    // First run: Create the fine-tune job
    if (run.runs === 1) {
      const { upload_base_path: uploadBasePath } =
        await app.getUploadBasePath({
          $,
        });

      await app.getExistingDataset({
        $,
        data: {
          dataset_id: datasetId,
          upload_base_path: uploadBasePath,
        },
      });

      const response = await createFineTuneJob({
        $,
        data: {
          model_name: modelName,
          dataset_id: datasetId,
          upload_file_path: `${uploadBasePath}/${datasetId}.jsonlines`,
          finetune_args: utils.parseJson(fineTuneArgs),
          gpu_config: utils.parseJson(gpuConfig),
          is_public: isPublic,
          custom_model_name: customModelName,
        },
      });

      $.export("$summary", `Successfully created a fine-tune job with ID \`${response.job_id}\`.`);

      // If user doesn't want to wait, return immediately
      if (!waitForCompletion || !context) {
        return response;
      }

      // Store job_id for polling and start rerun
      $.flow.rerun(DELAY, {
        jobId: response.job_id,
      }, MAX_RETRIES);
      return response;
    }

    // Subsequent runs: Poll for job status
    if (run.runs > MAX_RETRIES) {
      throw new Error("Max retries exceeded - fine-tuning job may still be running");
    }

    const { jobId } = run.context;

    // Poll for status
    const statusResponse = await app.getJobStatus({
      $,
      jobId,
    });

    // If job is completed, return the final status
    if (statusResponse.status === "COMPLETED") {
      $.export("$summary", `Fine-tuning job \`${jobId}\` completed successfully.`);
      return statusResponse;
    }

    // If job failed, throw error
    if (statusResponse.status === "FAILED") {
      throw new Error(`Fine-tuning job \`${jobId}\` failed.`);
    }

    // Otherwise, continue polling
    $.flow.rerun(DELAY, {
      jobId,
    }, MAX_RETRIES);
    return {
      status: statusResponse.status,
      jobId,
      message: `Job is still running. Current status: ${statusResponse.status}`,
    };
  },
};
