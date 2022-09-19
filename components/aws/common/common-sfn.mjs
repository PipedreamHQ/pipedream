import aws from "../aws.app.mjs";

import {
  SFNClient,
  CreateStateMachineCommand,
  DeleteStateMachineCommand,
  StartExecutionCommand,
  StopExecutionCommand,
} from "@aws-sdk/client-sfn";

export default {
  props: {
    aws,
    region: {
      propDefinition: [
        aws,
        "region",
      ],
    },
  },
  methods: {
    _clientSfn() {
      return this.aws.getAWSClient(SFNClient, this.region);
    },
    async createStateMachine(params) {
      return this._clientSfn().send(new CreateStateMachineCommand(params));
    },
    async deleteStateMachine(params) {
      return this._clientSfn().send(new DeleteStateMachineCommand(params));
    },
    async startExecution(params) {
      return this._clientSfn().send(new StartExecutionCommand(params));
    },
    async stopExecution(params) {
      return this._clientSfn().send(new StopExecutionCommand(params));
    },
  },
};
