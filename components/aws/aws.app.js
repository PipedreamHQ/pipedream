module.exports = {
  type: "app",
  app: "aws",
  methods: {
    sdk(region) {
      process.env.AWS_ACCESS_KEY_ID = this.$auth.accessKeyId;
      process.env.AWS_SECRET_ACCESS_KEY = this.$auth.secretAccessKey;
      const AWS = require("aws-sdk");
      AWS.config.update({ region });
      return AWS;
    },
    async logsInsightsDescibeLogGroups(region, lastToken) {
      const AWS = this.sdk(region);
      const cloudwatchlogs = new AWS.CloudWatchLogs();
      const data = await cloudwatchlogs
        .describeLogGroups({ nextToken: lastToken })
        .promise();
      const { logGroups, nextToken } = data;
      return { logGroups, nextToken };
    },
    async sesIdentities(region) {
      const AWS = this.sdk(region);
      const ses = new AWS.SES();
      return (await ses.listIdentities().promise()).Identities;
    },
  },
};
