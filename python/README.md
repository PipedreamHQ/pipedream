# Pipedream Python SDK

A Python client library for the [Pipedream Connect API](https://pipedream.com/docs/connect).

## Installation

```bash
pip install pipedream-sdk
```

## Quick Start

### Using OAuth Credentials

```python
from pipedream_sdk import create_client, OAuthCredentials

# Create client with OAuth credentials
credentials = OAuthCredentials(
    client_id="your_client_id",
    client_secret="your_client_secret"
)

client = create_client(
    project_id="your_project_id",
    credentials=credentials,
    environment="development"  # or "production"
)

# Create a Connect token for user authentication
token_response = client.create_connect_token({
    "external_user_id": "user123",
    "success_redirect_uri": "https://yourapp.com/success",
    "error_redirect_uri": "https://yourapp.com/error"
})

print(f"Connect URL: {token_response.connect_link_url}")
```

### Using Access Token

```python
from pipedream_sdk import create_client, AccessTokenCredentials

# Create client with access token
credentials = AccessTokenCredentials(access_token="your_access_token")

client = create_client(
    project_id="your_project_id",
    credentials=credentials
)
```

## Core Features

### Account Management

```python
# Get all connected accounts
accounts = client.get_accounts()

# Get accounts for a specific user
accounts = client.get_accounts({
    "external_user_id": "user123",
    "include_credentials": True
})

# Get a specific account
account = client.get_account_by_id("account_id", {
    "include_credentials": True
})

# Delete an account
client.delete_account("account_id")

# Delete all accounts for an external user
client.delete_external_user("user123")
```

### App Discovery

```python
# Get all available apps
apps = client.get_apps()

# Search for apps
apps = client.get_apps({
    "q": "slack",
    "has_actions": True,
    "limit": 10
})

# Get a specific app
app = client.get_app("slack")
```

### Component Management

```python
from pipedream_sdk.types import ComponentType

# Get all components
components = client.get_components()

# Get components for a specific app
components = client.get_components({
    "app": "slack",
    "component_type": ComponentType.ACTION
})

# Get a specific component
component = client.get_component({"key": "slack-send-message"})

# Configure a component prop
config_response = client.configure_component({
    "external_user_id": "user123",
    "component_id": "slack-send-message",
    "prop_name": "channel",
    "configured_props": {"text": "Hello world"}
})
```

### Running Actions

```python
# Run an action
result = client.run_action({
    "external_user_id": "user123",
    "action_id": "slack-send-message",
    "configured_props": {
        "channel": "#general",
        "text": "Hello from Pipedream!"
    }
})

print(f"Action result: {result.ret}")
```

### Trigger Management

```python
# Deploy a trigger
trigger = client.deploy_trigger({
    "external_user_id": "user123",
    "trigger_id": "github-new-commit",
    "configured_props": {
        "repo": "username/repo"
    },
    "webhook_url": "https://yourapp.com/webhook"
})

# Get deployed triggers
triggers = client.get_triggers({
    "external_user_id": "user123"
})

# Update a trigger
client.update_trigger({
    "id": trigger.id,
    "external_user_id": "user123",
    "active": False
})

# Get trigger events
events = client.get_trigger_events({
    "id": trigger.id,
    "external_user_id": "user123",
    "limit": 10
})

# Delete a trigger
client.delete_trigger({
    "id": trigger.id,
    "external_user_id": "user123"
})
```

### Workflow Invocation

```python
from pipedream_sdk.types import HTTPAuthType

# Invoke a workflow
response = client.invoke_workflow(
    "https://your-workflow-url.m.pipedream.net",
    data={"message": "Hello"},
    auth_type=HTTPAuthType.NONE
)

# Invoke a workflow for a specific user
response = client.invoke_workflow_for_external_user(
    "https://your-workflow-url.m.pipedream.net",
    external_user_id="user123",
    data={"message": "Hello"}
)
```

### Proxy API

```python
# Make a proxy request on behalf of a user
response = client.make_proxy_request(
    proxy_opts={
        "search_params": {
            "external_user_id": "user123",
            "account_id": "account_456"
        }
    },
    target_request={
        "url": "https://api.github.com/user/repos",
        "options": {
            "method": "GET",
            "headers": {"Accept": "application/json"}
        }
    }
)
```

## Error Handling

The SDK raises exceptions for API errors:

```python
try:
    account = client.get_account_by_id("invalid_id")
except Exception as e:
    print(f"API Error: {e}")
```

## Development

### Setup

```bash
git clone https://github.com/PipedreamHQ/pipedream.git
cd pipedream/python-sdk
pip install -e .
pip install -r requirements-dev.txt
```

### Testing

```bash
pytest
```

### Code Formatting

```bash
black pipedream_sdk/
flake8 pipedream_sdk/
mypy pipedream_sdk/
```

## Requirements

- Python 3.8+
- No external dependencies (uses only Python standard library)

## Documentation

For detailed API documentation, visit [Pipedream Connect Docs](https://pipedream.com/docs/connect).

## License

See the main Pipedream repository for license information. 