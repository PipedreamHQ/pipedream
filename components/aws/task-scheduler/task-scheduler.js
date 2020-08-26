const axios = require("axios");
const aws = require("https://github.com/PipedreamHQ/pipedream/components/aws/aws.app.js");
const shortid = require("shortid");

module.exports = {
  name: "New Scheduled Tasks",
  description:
    "Creates a Step Function State Machine to publish a message to an SNS topic at a specific timestamp. The SNS topic delivers the message to this Pipedream source, and the source emits it as a new event",
  version: "0.0.1",
  dedupe: "unique", // Dedupe on SNS message ID
  props: {
    region: {
      label: "AWS Region",
      description:
        "The AWS region string where you'd like to create your SNS topic",
      type: "string",
      default: "us-east-1",
    },
    aws,
    secret: {
      type: "string",
      secret: true,
      label: "Secret",
      optional: true,
      description:
        "**Optional but recommended**: if you enter a secret here, you must pass this value in [the `secret` parameter HTTP POST requests](https://github.com/PipedreamHQ/pipedream/tree/master/components/aws/task-scheduler#scheduling-a-task)",
    },
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const AWS = this.aws.sdk(this.region);
      const sns = new AWS.SNS();

      // We add an ID composed of the component ID and another random ID. The
      // component is included so it's clear to the user which component created
      // the resources. The short ID is included because these resources are
      // destroyed and created on component updates, and we hit race conditions
      // trying to delete and re-create a resource with the exact same name.
      const uuid = `${process.env.PD_COMPONENT}-${shortid.generate()}`;

      // Create an SNS topic and an associated subscription to
      // send messages from Step Functions -> Pipedream
      const topicName = `pipedream-scheduled-tasks-${uuid}`;
      console.log(`Creating SNS topic ${topicName}`);
      const topic = await sns.createTopic({ Name: topicName }).promise();
      this.db.set("topicARN", topic.TopicArn);

      const iam = new AWS.IAM();
      const stepfunctions = new AWS.StepFunctions();

      // Step Functions runs using a specific IAM role, which we create here,
      // scoped to only send messages to the SNS topic created above.
      // IAM doesn't accept an inline policy on the createRole API call, so we
      // create the role first, then update its inline policy.
      const topicArn = this.db.get("topicARN");
      const RoleName = `pipedream-scheduled-tasks-${uuid}-role`;
      this.db.set("roleName", RoleName);
      const createRoleResponse = await iam
        .createRole({
          RoleName,
          Description: `Service role for the Step Functions state machine created by the Pipedream Task Scheduler source ${process.env.PD_COMPONENT}`,
          AssumeRolePolicyDocument: `{
            "Version": "2012-10-17",
            "Statement": [
              {
                "Effect": "Allow",
                "Principal": {
                  "Service": "states.amazonaws.com"
                },
                "Action": "sts:AssumeRole"
              }
            ]
          }`,
          Path: "/pipedream/",
        })
        .promise();
      console.log(createRoleResponse);
      this.db.set("roleARN", createRoleResponse.Role.Arn);

      const putRolePolicyResponse = await iam
        .putRolePolicy({
          PolicyDocument: `{
            "Version": "2012-10-17",
            "Statement": [
              {
                "Effect": "Allow",
                "Action": [
                  "sns:Publish"
                ],
                "Resource": [
                  "${topicArn}"
                ]
              }
            ]
          }`,
          PolicyName: "publish-messages-to-pipedream-sns-topic",
          RoleName,
        })
        .promise();
      console.log(putRolePolicyResponse);

      // A Step Functions State Machine describes tasks and state transitions.
      // This state machine simply waits for the epoch timestamp passed as input
      // and publishes a message to SNS at that timestamp. The state machine
      // we create here is simply a template. When tasks are scheduled, this component
      // creates a new "execution" of this state machine for that specific task.
      stateMachineARN = (
        await stepfunctions
          .createStateMachine({
            definition: `{
              "Comment": "Task Scheduler",
              "StartAt": "Wait",
              "States": {
                "Wait": {
                  "Comment": "Wait until specified timestamp",
                  "Type": "Wait",
                  "TimestampPath": "$.timestamp",
                  "Next": "Send Message to SNS"
                },
                "Send Message to SNS":{  
                  "Type": "Task",
                  "Resource": "arn:aws:states:::sns:publish",
                  "Parameters": {  
                    "TopicArn": "${topicArn}",
                    "Message.$": "$"
                  },
                  "End": true
                }
              }
            }`,
            name: `pipedream-scheduled-tasks-${uuid}`,
            roleArn: createRoleResponse.Role.Arn,
          })
          .promise()
      ).stateMachineArn;
      this.db.set("stateMachineARN", stateMachineARN);

      console.log(
        `Subscribing this source's URL to SNS topic: ${this.http.endpoint}`
      );
      console.log(
        await sns
          .subscribe({
            TopicArn: topic.TopicArn,
            Protocol: "https",
            Endpoint: this.http.endpoint,
          })
          .promise()
      );
    },
    async deactivate() {
      const AWS = this.aws.sdk(this.region);
      const iam = new AWS.IAM();
      const sns = new AWS.SNS();
      const stepfunctions = new AWS.StepFunctions();

      const RoleName = this.db.get("roleName");
      const SubscriptionArn = this.db.get("subscriptionARN");
      const stateMachineArn = this.db.get("stateMachineARN");
      const TopicArn = this.db.get("topicARN");

      // The order of these deletes is deliberate, to ensure
      // linked resources are deleted before the parent
      console.log(`Deleting SNS subscription ${SubscriptionArn}`);
      console.log(await sns.unsubscribe({ SubscriptionArn }).promise());

      console.log(`Deleting state machine ${stateMachineArn}`);
      console.log(
        await stepfunctions.deleteStateMachine({ stateMachineArn }).promise()
      );

      console.log(`Deleting SNS topic ${TopicArn}`);
      console.log(await sns.deleteTopic({ TopicArn }).promise());

      console.log(`Deleting Role policy`);
      console.log(
        await iam
          .deleteRolePolicy({
            RoleName,
            PolicyName: "publish-messages-to-pipedream-sns-topic",
          })
          .promise()
      );

      console.log(`Deleting IAM role ${RoleName}`);
      console.log(await iam.deleteRole({ RoleName }).promise());
    },
  },
  async run(event) {
    const { body, path, headers } = event;

    // SNS SUBSCRIPTION CONFIRMATION - ONE TIME REQUEST
    if (body.Type && body.Type === "SubscriptionConfirmation") {
      console.log("Confirming SNS subscription");
      const { data } = await axios({ url: body.SubscribeURL });
      this.db.set(
        "subscriptionARN",
        data.ConfirmSubscriptionResponse.ConfirmSubscriptionResult
          .SubscriptionArn
      );
      console.log(data);

      // Emit a sample message so the user sees the format
      const timestamp = new Date().toISOString();
      const message = "Sample message";
      const metadata = {
        summary: message,
        id: headers["x-amz-sns-message-id"],
        ts: +new Date(body.Timestamp),
      };

      this.$emit({ message, timestamp }, metadata);
      return;
    }

    // SCHEDULE NEW TASK
    if (path === "/schedule") {
      const { timestamp, message, secret } = body;
      const errors = [];
      // Secrets are optional, so we first check if the user configured
      // a secret, then check its value against the prop (validation below)
      if (this.secret && secret !== this.secret) {
        errors.push(
          "Secret on incoming request doesn't match the configured secret"
        );
      }
      if (!timestamp) {
        errors.push(
          "No timestamp included in payload. Please provide an ISO8601 timestamp in the 'timestamp' field"
        );
      }
      if (!message) {
        errors.push("No message passed in payload");
      }
      if (errors.length) {
        console.log(errors);
        this.http.respond({
          status: 400,
          body: {
            errors,
          },
        });
        return;
      }

      const AWS = this.aws.sdk(this.region);
      const stepfunctions = new AWS.StepFunctions();
      let stateMachineARN = this.db.get("stateMachineARN");
      console.log("Scheduling task");

      let msg, status;
      try {
        const { executionArn } = await stepfunctions
          .startExecution({
            stateMachineArn: stateMachineARN,
            input: JSON.stringify(body),
          })
          .promise();
        console.log(executionArn);
        status = 200;
        msg = {
          executionArn,
          timestamp,
        };
      } catch (err) {
        status = 500;
        msg = "Failed to schedule task. Please see logs";
        console.log(err);
      }

      this.http.respond({
        status,
        body: {
          msg,
        },
        headers: {
          "content-type": "application/json",
        },
      });

      return;
    }

    // CANCEL SCHEDULED TASK
    // The user must pass an executionArn they'd like to cancel
    if (path === "/cancel") {
      const { executionArn, secret } = body;
      if (this.secret && secret !== this.secret) {
        errors.push(
          "Secret on incoming request doesn't match the configured secret"
        );
      }

      let msg, status;
      try {
        const AWS = this.aws.sdk(this.region);
        const stepfunctions = new AWS.StepFunctions();
        const stopExecutionResp = await stepfunctions
          .stopExecution({
            executionArn,
          })
          .promise();
        console.log(stopExecutionResp);
        status = 200;
        msg = `Cancelled scheduled task for ${executionArn}`;
      } catch (err) {
        status = 500;
        msg = "Failed to schedule task. Please see logs";
        console.log(err);
      }

      this.http.respond({
        status,
        body: {
          msg,
        },
        headers: {
          "content-type": "application/json",
        },
      });

      return;
    }

    // TASK IS SCHEDULED - EMIT!
    if (!body.Message) {
      console.log("No SNS message present, exiting");
      return;
    }

    const { message, secret, timestamp } = JSON.parse(body.Message);
    if (this.secret && secret !== this.secret) {
      console.log(
        "Incoming message from SNS does not contain the configured secret. Exiting"
      );
      return;
    }

    const metadata = {
      summary: body.Subject || JSON.stringify(message),
      id: headers["x-amz-sns-message-id"],
      ts: +new Date(body.Timestamp),
    };

    this.$emit({ message, timestamp }, metadata);
  },
};
