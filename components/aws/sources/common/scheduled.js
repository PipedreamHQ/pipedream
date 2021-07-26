const base = require("./sns");
const {
  generateRandomUniqueName,
  toSingleLineString,
} = require("./utils");

module.exports = {
  ...base,
  hooks: {
    ...base.hooks,
    async activate() {
      await base.hooks.activate.bind(this)();

      const {
        roleArn,
        roleName,
      } = await this._createStateMachineRole();
      await this._grantNotificationPermissions(roleName);
      this._setRoleArn(roleArn);
      this._setRoleName(roleName);

      const { stateMachineArn } = await this._createStateMachine(roleArn);
      this._setStateMachineArn(stateMachineArn);
    },
    async deactivate() {
      const stateMachineArn = this._getStateMachineArn();
      await this._deleteStateMachine(stateMachineArn);

      const region = this.getRegion();
      const roleName = this._getRoleName();
      await this.aws.deleteRole(region, roleName);

      await base.hooks.deactivate.bind(this)();
    },
  },
  props: {
    ...base.props,
    secret: {
      type: "string",
      secret: true,
      label: "Secret",
      optional: true,
      description: toSingleLineString(`
        **Optional but recommended**: if you enter a secret here,
        you must pass this value in [the
        \`secret\` parameter of each HTTP POST request](https://git.io/JsJ6m)
      `),
    },
  },
  methods: {
    ...base.methods,
    _getRoleArn() {
      return this.db.get("roleArn");
    },
    _setRoleArn(roleArn) {
      this.db.set("roleArn", roleArn);
    },
    _getRoleName() {
      return this.db.get("roleName");
    },
    _setRoleName(roleName) {
      this.db.set("roleName", roleName);
    },
    _getStateMachineArn() {
      return this.db.get("stateMachineArn");
    },
    _setStateMachineArn(stateMachineArn) {
      this.db.set("stateMachineArn", stateMachineArn);
    },
    _getSfnClient() {
      const region = this.getRegion();
      const AWS = this.aws.sdk(region);
      return new AWS.StepFunctions();
    },
    _createStateMachineRole() {
      const { PD_COMPONENT: componentId } = process.env;
      const roleDescription = `
        Service role for the Step Functions state machine created
        by the Pipedream Task Scheduler source ${componentId}
      `;
      return this.aws.createServiceRole(
        this.getRegion(),
        "states.amazonaws.com",
        roleDescription,
      );
    },
    _grantNotificationPermissions(roleName) {
      return this.aws.addPermissionsToRole(
        this.getRegion(),
        roleName,
        this.getStateMachinePermissions(),
      );
    },
    _createStateMachine(roleArn) {
      const definition = JSON.stringify(
        this.getStateMachineDefinition(),
      );
      const params = {
        definition,
        name: generateRandomUniqueName(),
        roleArn,
      };
      return this
        ._getSfnClient()
        .createStateMachine(params)
        .promise();
    },
    _deleteStateMachine(stateMachineArn) {
      const params = {
        stateMachineArn,
      };
      return this
        ._getSfnClient()
        .deleteStateMachine(params)
        .promise();
    },
    _cancelExecution(executionArn) {
      const params = {
        executionArn,
      };
      return this
        ._getSfnClient()
        .stopExecution(params)
        .promise();
    },
    _scheduleExecution(event) {
      const stateMachineArn = this._getStateMachineArn();
      const { bodyRaw: input } = event;
      const params = {
        stateMachineArn,
        input,
      };
      return this
        ._getSfnClient()
        .startExecution(params)
        .promise();
    },
    _sendHttpResponse(status = 200, body = {}) {
      this.http.respond({
        status,
        body,
        headers: {
          "content-type": "application/json",
        },
      });
    },
    async _cancelHandler(event) {
      const {
        // The user must pass an executionArn they'd like to cancel
        executionArn,
        secret,
      } = event.body;

      const errors = [];
      // Secrets are optional, so we first check if the user configured
      // a secret, then check its value against the prop (validation below)
      if (this.secret && secret !== this.secret) {
        errors.push("Secret on incoming request doesn't match the configured secret");
      }
      if (!executionArn) {
        errors.push("No executionArn included in payload");
      }
      if (errors.length > 0) {
        console.log(errors);
        const body = {
          errors,
        };
        this._sendHttpResponse(400, body);
        return;
      }

      let msg, status;
      try {
        const stopExecutionResp = await this._cancelExecution(executionArn);
        console.log(stopExecutionResp);
        status = 200;
        msg = `Cancelled scheduled task for ${executionArn}`;
      } catch (err) {
        status = 500;
        msg = "Failed to cancel task. Please see logs";
        console.log(err);
      }

      const body = {
        msg,
      };
      this._sendHttpResponse(status, body);
    },
    async _scheduleHandler(event) {
      const {
        timestamp,
        message,
        secret,
      } = event.body;

      const errors = [];
      // Secrets are optional, so we first check if the user configured
      // a secret, then check its value against the prop (validation below)
      if (this.secret && secret !== this.secret) {
        errors.push(
          "Secret on incoming request doesn't match the configured secret",
        );
      }
      if (!timestamp) {
        errors.push(
          "No timestamp included in payload. Please provide an ISO8601 timestamp in the 'timestamp' field",
        );
      }
      if (!message) {
        errors.push("No message passed in payload");
      }
      if (errors.length) {
        console.log(errors);
        const body = {
          errors,
        };
        this._sendHttpResponse(400, body);
        return;
      }

      let msg, status;
      try {
        console.log("Scheduling task");
        const { executionArn } = await this._scheduleExecution(event);
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

      const body = {
        msg,
      };
      this._sendHttpResponse(status, body);
      return;
    },
    /**
     * This method returns an AWS Step Functions state machine definition in as
     * a JSON-serializable object. Event sources that extend this module must
     * implement this method since it determines the specific behaviour of the
     * underlying state machine that will run at each scheduled execution.
     *
     * @see {@link https://amzn.to/2RYYgvC Amazon States Language}
     * @see {@link https://states-language.net/spec.html Amazon States Language Spec}
     *
     * @returns {Object} a JSON-serializable state machine definition in Amazon
     * States Language
     */
    getStateMachineDefinition() {
      throw new Error("getStateMachineDefinition is not implemented");
    },
    getStateMachinePermissions() {
      throw new Error("getStateMachinePermissions is not implemented");
    },
    getTopicName() {
      const topicNameCandidate = generateRandomUniqueName();
      return this.convertNameToValidSNSTopicName(topicNameCandidate);
    },
    async processEvent(event) {
      const {
        body,
        path,
      } = event;

      // SCHEDULE NEW TASK
      if (path === "/schedule") {
        return this._scheduleHandler(event);
      }

      // CANCEL SCHEDULED TASK
      if (path === "/cancel") {
        return this._cancelHandler(event);
      }

      if (path !== "/") {
        // If the call targets an unrecognized path then we respond with a `404
        // Not Found` status
        this.http.respond({
          status: 404,
        });
        return;
      }

      // TASK IS SCHEDULED - EMIT!

      const { Message: message } = body;
      if (!message) {
        console.log("No SNS message present, exiting");
        return;
      }

      const { secret } = JSON.parse(message);
      if (this.secret && secret !== this.secret) {
        console.log(
          "Incoming message from SNS does not contain the configured secret. Exiting",
        );
        return;
      }

      return base.methods.processEvent.bind(this)(event);
    },
  },
};
