import app from "../../databricks.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "databricks-create-job",
  name: "Create Job",
  description: "Create a job. [See the documentation](https://docs.databricks.com/api/workspace/jobs/create)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    tasks: {
      type: "string[]",
      label: "Tasks",
      description: `A list of task specifications to be executed by this job. JSON string format. [See the API documentation](https://docs.databricks.com/api/workspace/jobs/create#tasks) for task specification details.

**Example:**
\`\`\`json
[
  {
    "notebook_task": {
      "notebook_path": "/Workspace/Users/sharky@databricks.com/weather_ingest"
    },
    "task_key": "weather_ocean_data"
  }
]
\`\`\`
      `,
    },
    name: {
      type: "string",
      label: "Job Name",
      description: "An optional name for the job",
      optional: true,
    },
    tags: {
      type: "object",
      label: "Tags",
      description: "A map of tags associated with the job. These are forwarded to the cluster as cluster tags for jobs clusters, and are subject to the same limitations as cluster tags",
      optional: true,
    },
    jobClusters: {
      type: "string[]",
      label: "Job Clusters",
      description: `A list of job cluster specifications that can be shared and reused by tasks of this job. JSON string format. [See the API documentation](https://docs.databricks.com/api/workspace/jobs/create#job_clusters) for job cluster specification details.

**Example:**
\`\`\`json
[
  {
    "job_cluster_key": "auto_scaling_cluster",
    "new_cluster": {
      "autoscale": {
        "max_workers": 16,
        "min_workers": 2
      },
      "node_type_id": null,
      "spark_conf": {
        "spark.speculation": true
      },
      "spark_version": "7.3.x-scala2.12"
    }
  }
]
\`\`\`
      `,
      optional: true,
    },
    emailNotifications: {
      type: "string",
      label: "Email Notifications",
      description: `An optional set of email addresses to notify when runs of this job begin, complete, or when the job is deleted. Specify as a JSON object with keys for each notification type. [See the API documentation](https://docs.databricks.com/api/workspace/jobs/create#email_notifications) for details on each field.

**Example:**
\`\`\`json
{
  "on_start": ["user1@example.com"],
  "on_success": ["user2@example.com"],
  "on_failure": ["user3@example.com"],
  "on_duration_warning_threshold_exceeded": ["user4@example.com"],
  "on_streaming_backlog_exceeded": ["user5@example.com"]
}
\`\`\`
`,
      optional: true,
    },
    webhookNotifications: {
      type: "string",
      label: "Webhook Notifications",
      description: `A collection of system notification IDs to notify when runs of this job begin, complete, or encounter specific events. Specify as a JSON object with keys for each notification type. Each key accepts an array of objects with an \`id\` property (system notification ID). A maximum of 3 destinations can be specified for each property.

Supported keys:
- \`on_start\`: Notified when the run starts.
- \`on_success\`: Notified when the run completes successfully.
- \`on_failure\`: Notified when the run fails.
- \`on_duration_warning_threshold_exceeded\`: Notified when the run duration exceeds the specified threshold.
- \`on_streaming_backlog_exceeded\`: Notified when streaming backlog thresholds are exceeded.

[See the API documentation](https://docs.databricks.com/api/workspace/jobs/create#webhook_notifications) for details.

**Example:**
\`\`\`json
{
  "on_success": [
    { "id": "https://eoiqkb8yzox6u2n.m.pipedream.net" }
  ],
  "on_failure": [
    { "id": "https://another-webhook-url.com/notify" }
  ]
}
\`\`\`
`,
      optional: true,
    },
    timeoutSeconds: {
      type: "integer",
      label: "Timeout Seconds",
      description: "An optional timeout applied to each run of this job. The default behavior is to have no timeout",
      optional: true,
    },
    schedule: {
      type: "string",
      label: "Schedule",
      description: `An optional periodic schedule for this job, specified as a JSON object. By default, the job only runs when triggered manually or via the API. The schedule object must include:

- \`quartz_cron_expression\` (**required**): A Cron expression using Quartz syntax that defines when the job runs. [See Cron Trigger details](https://docs.databricks.com/api/workspace/jobs/create#schedule).
- \`timezone_id\` (**required**): A Java timezone ID (e.g., "Europe/London") that determines the timezone for the schedule. [See Java TimeZone details](https://docs.databricks.com/api/workspace/jobs/create#schedule).
- \`pause_status\` (optional): Set to \`"UNPAUSED"\` (default) or \`"PAUSED"\` to control whether the schedule is active.

**Example:**
\`\`\`json
{
  "quartz_cron_expression": "0 0 12 * * ?",
  "timezone_id": "Asia/Ho_Chi_Minh",
  "pause_status": "UNPAUSED"
}
\`\`\`
`,
      optional: true,
    },
    maxConcurrentRuns: {
      type: "integer",
      label: "Max Concurrent Runs",
      description: "An optional maximum allowed number of concurrent runs of the job. Defaults to 1",
      optional: true,
    },
    gitSource: {
      type: "string",
      label: "Git Source",
      description: `An optional specification for a remote Git repository containing the source code used by tasks. Provide as a JSON string.

This enables version-controlled source code for notebook, dbt, Python script, and SQL File tasks. If \`git_source\` is set, these tasks retrieve files from the remote repository by default (can be overridden per task by setting \`source\` to \`WORKSPACE\`). **Note:** dbt and SQL File tasks require \`git_source\` to be defined. [See the API documentation](https://docs.databricks.com/api/workspace/jobs/create#git_source) for more details.

**Fields:**
- \`git_url\` (**required**): URL of the repository to be cloned (e.g., "https://github.com/databricks/databricks-cli").
- \`git_provider\` (**required**): Service hosting the repository. One of: \`gitHub\`, \`bitbucketCloud\`, \`azureDevOpsServices\`, \`gitHubEnterprise\`, \`bitbucketServer\`, \`gitLab\`, \`gitLabEnterpriseEdition\`, \`awsCodeCommit\`.
- \`git_branch\`: Name of the branch to check out (cannot be used with \`git_tag\` or \`git_commit\`).
- \`git_tag\`: Name of the tag to check out (cannot be used with \`git_branch\` or \`git_commit\`).
- \`git_commit\`: Commit hash to check out (cannot be used with \`git_branch\` or \`git_tag\`).

**Example:**
\`\`\`json
{
  "git_url": "https://github.com/databricks/databricks-cli",
  "git_provider": "gitHub",
  "git_branch": "main"
}
\`\`\`
`,
      optional: true,
    },
    accessControlList: {
      type: "string[]",
      label: "Access Control List",
      description: `A list of permissions to set on the job, specified as a JSON array of objects. Each object can define permissions for a user, group, or service principal. 

Each object may include:
- \`user_name\`: Name of the user.
- \`group_name\`: Name of the group.
- \`service_principal_name\`: Application ID of a service principal.
- \`permission_level\`: Permission level. One of: \`CAN_MANAGE\`, \`IS_OWNER\`, \`CAN_MANAGE_RUN\`, \`CAN_VIEW\`.

**Example:**
\`\`\`json
[
  {
    "permission_level": "IS_OWNER",
    "user_name": "jorge.c@turing.com"
  },
  {
    "permission_level": "CAN_VIEW",
    "group_name": "data-scientists"
  }
]
\`\`\`
[See the API documentation](https://docs.databricks.com/api/workspace/jobs/create#access_control_list) for more details.`,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      tasks,
      name,
      tags,
      jobClusters,
      emailNotifications,
      webhookNotifications,
      timeoutSeconds,
      schedule,
      maxConcurrentRuns,
      gitSource,
      accessControlList,
    } = this;

    const response = await app.createJob({
      $,
      data: {
        name,
        tags,
        tasks: utils.parseJsonInput(tasks),
        job_clusters: utils.parseJsonInput(jobClusters),
        email_notifications: utils.parseJsonInput(emailNotifications),
        webhook_notifications: utils.parseJsonInput(webhookNotifications),
        timeout_seconds: timeoutSeconds,
        schedule: utils.parseJsonInput(schedule),
        max_concurrent_runs: maxConcurrentRuns,
        git_source: utils.parseJsonInput(gitSource),
        access_control_list: utils.parseJsonInput(accessControlList),
      },
    });

    $.export("$summary", `Successfully created job with ID \`${response.job_id}\``);

    return response;
  },
};
