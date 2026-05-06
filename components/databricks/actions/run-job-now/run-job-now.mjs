import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-run-job-now",
  name: "Run Job Now",
  description: "Run a job now and return the id of the triggered run. [See the documentation](https://docs.databricks.com/en/workflows/jobs/jobs-2.0-api.html#runs-list)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    databricks,
    jobId: {
      propDefinition: [
        databricks,
        "jobId",
      ],
    },
    jarParams: {
      type: "string[]",
      label: "JAR Params",
      description: "A list of parameters for jobs with JAR tasks, e.g. \"jar_params\": [\"john doe\", \"35\"]. The parameters will be used to invoke the main function of the main class specified in the Spark JAR task. If not specified upon run-now, it will default to an empty list. jar_params cannot be specified in conjunction with notebook_params. The JSON representation of this field (i.e. {\"jar_params\":[\"john doe\",\"35\"]}) cannot exceed 10,000 bytes.",
      optional: true,
    },
    notebookParams: {
      type: "object",
      label: "Notebook Params",
      description: "A map from keys to values for jobs with notebook task, e.g. \"notebook_params\": {\"name\": \"john doe\", \"age\":  \"35\"}. The map is passed to the notebook and is accessible through the dbutils.widgets.get function. If not specified upon run-now, the triggered run uses the job’s base parameters. You cannot specify notebook_params in conjunction with jar_params. The JSON representation of this field (i.e. {\"notebook_params\":{\"name\":\"john doe\",\"age\":\"35\"}}) cannot exceed 10,000 bytes.",
      optional: true,
    },
    pythonParams: {
      type: "string[]",
      label: "Python Params",
      description: "A list of parameters for jobs with Python tasks, e.g. \"python_params\": [\"john doe\", \"35\"]. The parameters will be passed to Python file as command-line parameters. If specified upon run-now, it would overwrite the parameters specified in job setting. The JSON representation of this field (i.e. {\"python_params\":[\"john doe\",\"35\"]}) cannot exceed 10,000 bytes.",
      optional: true,
    },
    sparkSubmitParams: {
      type: "string[]",
      label: "Spark Submit Params",
      description: "A list of parameters for jobs with spark submit task, e.g. \"spark_submit_params\": [\"--class\", \"org.apache.spark.examples.SparkPi\"]. The parameters will be passed to spark-submit script as command-line parameters. If specified upon run-now, it would overwrite the parameters specified in job setting. The JSON representation of this field cannot exceed 10,000 bytes.",
      optional: true,
    },
    idempotencyToken: {
      type: "string",
      label: "Idempotency Token",
      description: "An optional token to guarantee the idempotency of job run requests. If a run with the provided token already exists, the request does not create a new run but returns the ID of the existing run instead. If a run with the provided token is deleted, an error is returned. If you specify the idempotency token, upon failure you can retry until the request succeeds. Databricks guarantees that exactly one run is launched with that idempotency token. This token must have at most 64 characters. For more information, see [How to ensure idempotency for jobs](https://kb.databricks.com/jobs/jobs-idempotency.html).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.databricks.runJobNow({
      data: {
        job_id: this.jobId,
        jar_params: this.jarParams,
        notebook_params: this.notebookParams,
        python_params: this.pythonParams,
        spark_submit_params: this.sparkSubmitParams,
        idempotency_token: this.idempotencyToken,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully initiated job with ID ${this.jobId}.`);
    }

    return response;
  },
};
