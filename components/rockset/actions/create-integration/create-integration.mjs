// legacy_hash_id: a_poikrY
import { axios } from "@pipedream/platform";

export default {
  key: "rockset-create-integration",
  name: "Create Integration",
  description: "Create a new integration with Rockset. Learn more at https://docs.rockset.com/rest/#createintegration",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rockset: {
      type: "app",
      app: "rockset",
    },
    name: {
      type: "string",
      description: "Descriptive label for the integration.",
    },
    description: {
      type: "string",
      description: "Description for the integration.",
      optional: true,
    },
    s3: {
      type: "object",
      description: "Amazon S3 details, must have one of aws_access_key or aws_role. E.g., `{\n      \"aws_role\": {\n        \"aws_role_arn\": \"arn:aws:iam::2378964092:role/rockset-role\"\n      },\n      \"aws_access_key\": {\n        \"aws_access_key_id\": \"AKIAIOSFODNN7EXAMPLE\",\n        \"aws_secret_access_key\": \"wJal....\"\n      }\n    }`",
      optional: true,
    },
    kinesis: {
      type: "object",
      description: "Amazon Kinesis details, must have one of aws_access_key or aws_role. E.g., `{\n      \"aws_role\": {\n        \"aws_role_arn\": \"arn:aws:iam::2378964092:role/rockset-role\"\n      },\n      \"aws_access_key\": {\n        \"aws_access_key_id\": \"AKIAIOSFODNN7EXAMPLE\",\n        \"aws_secret_access_key\": \"wJal....\"\n      }\n    }`",
      optional: true,
    },
    dynamodb: {
      type: "object",
      description: "Amazon DynamoDB details, must have one of aws_access_key or aws_role. E.g., `{\n      \"aws_access_key\": {\n        \"aws_access_key_id\": \"AKIAIOSFODNN7EXAMPLE\",\n        \"aws_secret_access_key\": \"wJal....\"\n      },\n      \"aws_role\": {\n        \"aws_role_arn\": \"arn:aws:iam::2378964092:role/rockset-role\"\n      }\n    }`",
      optional: true,
    },
    redshift: {
      type: "object",
      description: "Amazon Redshift details. E.g., `{\n      \"aws_access_key\": {\n        \"aws_access_key_id\": \"AKIAIOSFODNN7EXAMPLE\",\n        \"aws_secret_access_key\": \"wJal....\"\n      },\n      \"username\": \"awsuser\",\n      \"password\": \"pswd....\",\n      \"host\": \"test.yuyugt.us-west-2.redshift.amazonaws.com\",\n      \"port\": 5439,\n      \"s3_bucket_path\": \"s3://redshift-unload\"\n    }`",
      optional: true,
    },
    gcs: {
      type: "object",
      description: "GCS details. E.g., `{\n      \"gcp_service_account\": {}\n    }`",
      optional: true,
    },
    segment: {
      type: "object",
      optional: true,
    },
    kafka: {
      type: "object",
      description: "E.g., `{\n      \"kafka_topic_names\": [\n        null\n      ],\n      \"kafka_data_format\": \"json\",\n      \"source_status_by_topic\": \"topic-a:DORMANT\"\n    }`",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      "name": this.name,
      "description": this.description,
      "s3": this.s3,
      "kinesis": this.kinesis,
      "dynamodb": this.dynamodb,
      "redshift": this.redshift,
      "gcs": this.gcs,
      "segment": this.segment,
      "kafka": this.kafka,
    };

    return await axios($, {
      method: "POST",
      url: "https://api.rs2.usw2.rockset.com/v1/orgs/self/integrations",
      headers: {
        "Authorization": `ApiKey ${this.rockset.$auth.apikey}`,
      },
      data,
    });
  },
};
