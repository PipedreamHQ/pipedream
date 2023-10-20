# Getting Started

DeployHQ doesn't provide a way to automatically setup webhooks so sources will need to be registered with DeployHQ manually. The source will need to be registered as an [HTTP POST Integration](https://www.deployhq.com/support/integrations/http-post).

1. Create a source
2. In DeployHQ go to "Integrations" > "New Integration" > "HTTP POST"
3. Copy the endpoint from the source to the "Endpoint" field in DeployHQ
4. Select the option that matches your source from the "Trigger integration when..." list. For the source to work you must select at least the type of event that matches the source, e.g. "A deployment starts" for the "Deploy Started" source.
5. Select the servers and groups you would like your source to emit events for.
6. Click "Create integration"

