module.exports = {
  generateBucketSnsPolicy: (bucketName, topicArn) => ({
    Version: "2012-10-17",
    Id: `pd-bucket-sns-publish-${bucketName}`,
    Statement: [
      {
        Sid: `pd-bucket-sns-publish-${bucketName}`,
        Effect: "Allow",
        Principal: {
          Service: "s3.amazonaws.com",
        },
        Action: "SNS:Publish",
        Resource: topicArn,
        Condition: {
          ArnLike: {
            "aws:SourceArn": `arn:aws:s3:::${bucketName}`,
          },
        },
      },
    ],
  }),
};
