const aws = require("https://github.com/PipedreamHQ/pipedream/components/aws/aws.app.js");
const axios = require("axios");
const shortid = require("shortid");

module.exports = {
  name: "Task Scheduler with Step Functions + SNS",
  description:
    "Creates a Step Function State Machine to publish a message to an SNS topic at a specific timestamp. The SNS topic delivers the message to this Pipedream source",
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
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const AWS = this.aws.sdk(this.region);
      const sns = new AWS.SNS();

      // Generate a UUID that we include in the name of all resources below
      const id = shortid.generate();
      this.db.set("id", id);

      // Create an SNS topic and an associated subscription to
      // send messages from Step Functions -> Pipedream
      const topicName = `pipedream-scheduled-tasks-${id}`;
      console.log(`Creating SNS topic ${topicName}`);
      const topic = await sns.createTopic({ Name: topicName }).promise();
      this.db.set("topicARN", topic.TopicArn);
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

      const RoleName = this.db.get("roleName");
      const SubscriptionArn = this.db.get("subscriptionARN");
      const stateMachineArn = this.db.get("stateMachineARN");
      const TopicArn = this.db.get("topicARN");

      console.log(`Deleting SNS subscription ${SubscriptionArn}`);
      console.log(await sns.unsubscribe({ SubscriptionArn }).promise());

      console.log(`Deleting SNS topic ${TopicArn}`);
      console.log(await sns.deleteTopic({ TopicArn }).promise());

      console.log(`Deleting state machine ${stateMachineArn}`);
      console.log(await iam.deleteRole({ stateMachineArn }).promise());

      console.log(`Deleting IAM role ${RoleName}`);
      console.log(await iam.deleteRole({ RoleName }).promise());
    },
  },
  async run(event) {
    const { body, headers } = event;

    if (body.Type === "SubscriptionConfirmation") {
      console.log("Confirming SNS subscription");
      const { data } = await axios({ url: body.SubscribeURL });
      this.db.set(
        "subscriptionARN",
        data.ConfirmSubscriptionResponse.ConfirmSubscriptionResult
          .SubscriptionArn
      );
      console.log(data);

      // Step Functions runs using a specific IAM role, which we create here,
      // scoped to only send messages to the SNS topic created above.
      // IAM doesn't accept an inline policy on the createRole API call, so we
      // create the role first, then update its inline policy.
      const AWS = this.aws.sdk(this.region);
      const iam = new AWS.IAM();
      const stepfunctions = new AWS.StepFunctions();
      const id = this.db.get("id");
      const topicArn = this.db.get("topicARN");
      const RoleName = `pipedream-scheduled-tasks-${id}-role`;
      this.db.set("roleName", RoleName);
      const createRoleResponse = await iam
        .createRole({
          RoleName,
          Description: `Service role for the Step Functions state machine created by the Pipedream Task Scheduler source ${id}`,
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
      const { stateMachineArn } = await stepfunctions
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
                  "Message.$": "$.input.message"
                },
                "End": true
              }
            }
          }`,
          name: `pipedream-scheduled-tasks-${id}`,
          roleArn: createRoleResponse.Role.Arn,
        })
        .promise();
      this.db.set("stateMachineARN", stateMachineArn);
    } else {
      if (!body.Message) {
        console.log("No message present, exiting");
        return;
      }

      // Emit metadata
      const metadata = {
        summary: body.Subject || body.Message,
        id: headers["x-amz-sns-message-id"],
        ts: +new Date(body.Timestamp),
      };

      try {
        this.$emit(JSON.parse(body.Message), metadata);
      } catch (err) {
        console.log(
          `Couldn't parse message as JSON. Emitting raw message. Error: ${err}`
        );
        this.$emit({ rawMessage: body.Message }, metadata);
      }
    }
  },
};
