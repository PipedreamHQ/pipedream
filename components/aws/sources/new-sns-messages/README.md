# SNS to Pipedream Subscription

This source creates an SNS topic in the linked AWS account. Once the topic is
created, the source creates an HTTPS subscription to this source's HTTP
endpoint. Any messages published to this SNS topic are emitted by this source.

When deactivating this event source, the SNS topic created during deployment
will be permanently deleted. **This includes the cases when the event source's
configuration changes, since each configuration change triggers a deactivation
and subsequent activation.**

See the [main `README` document](../README.md) for detailed information about
how this event source is setup and works internally.
