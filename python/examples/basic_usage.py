#!/usr/bin/env python3
"""
Basic usage example for Pipedream Python SDK.

This example demonstrates the core functionality of the Pipedream SDK.
"""

import os
from pipedream_sdk import create_client, OAuthCredentials, AccessTokenCredentials
from pipedream_sdk.types import ComponentType, HTTPAuthType


def main():
    """Main example function."""
    # Example 1: Create client with OAuth credentials
    print("=== Creating Client with OAuth Credentials ===")
    
    oauth_credentials = OAuthCredentials(
        client_id=os.getenv("PIPEDREAM_CLIENT_ID", "your_client_id"),
        client_secret=os.getenv("PIPEDREAM_CLIENT_SECRET", "your_client_secret")
    )
    
    client = create_client(
        project_id=os.getenv("PIPEDREAM_PROJECT_ID", "your_project_id"),
        credentials=oauth_credentials,
        environment="development"
    )
    
    print(f"Client created with version: {client.version}")
    
    # Example 2: Create a Connect token
    print("\n=== Creating Connect Token ===")
    try:
        token_response = client.create_connect_token({
            "external_user_id": "demo_user_123",
            "success_redirect_uri": "https://yourapp.com/success",
            "error_redirect_uri": "https://yourapp.com/error"
        })
        
        print(f"Connect token: {token_response.token}")
        print(f"Connect URL: {token_response.connect_link_url}")
        print(f"Expires at: {token_response.expires_at}")
    except Exception as e:
        print(f"Error creating connect token: {e}")
    
    # Example 3: Get available apps
    print("\n=== Getting Available Apps ===")
    try:
        apps = client.get_apps({"limit": 5})
        print(f"Found {len(apps)} apps:")
        for app in apps:
            print(f"  - {app.name} ({app.name_slug}) - {app.auth_type.value}")
    except Exception as e:
        print(f"Error getting apps: {e}")
    
    # Example 4: Search for Slack app
    print("\n=== Searching for Slack App ===")
    try:
        slack_apps = client.get_apps({"q": "slack", "limit": 1})
        if slack_apps:
            slack_app = slack_apps[0]
            print(f"Found Slack app: {slack_app.name}")
            print(f"  - Auth type: {slack_app.auth_type.value}")
            print(f"  - Categories: {slack_app.categories}")
        else:
            print("Slack app not found")
    except Exception as e:
        print(f"Error searching for Slack: {e}")
    
    # Example 5: Get components for Slack
    print("\n=== Getting Slack Components ===")
    try:
        components = client.get_components({
            "app": "slack",
            "component_type": ComponentType.ACTION,
            "limit": 3
        })
        print(f"Found {len(components)} Slack actions:")
        for component in components:
            print(f"  - {component.name} ({component.key})")
    except Exception as e:
        print(f"Error getting components: {e}")
    
    # Example 6: Get connected accounts
    print("\n=== Getting Connected Accounts ===")
    try:
        accounts = client.get_accounts({"limit": 5})
        print(f"Found {len(accounts)} connected accounts:")
        for account in accounts:
            # Handle case where app might be a dict
            app_name = account.app.get('name') if isinstance(account.app, dict) else account.app.name
            print(f"  - {account.name} ({app_name}) - Healthy: {account.healthy}")
    except Exception as e:
        print(f"Error getting accounts: {e}")
    
    # Example 7: Get project info (commented out - endpoint doesn't exist)
    # print("\n=== Getting Project Info ===")
    # try:
    #     project_info = client.get_project_info()
    #     print(f"Project info: {project_info}")
    # except Exception as e:
    #     print(f"Error getting project info: {e}")
    
    print("\n=== Example completed ===")


def action_example():
    """Example of running an action."""
    print("\n=== Action Example ===")
    
    # This is a more advanced example that requires actual credentials
    # and a connected account
    
    client = create_client(
        project_id=os.getenv("PIPEDREAM_PROJECT_ID", "your_project_id"),
        credentials=AccessTokenCredentials(
            access_token=os.getenv("PIPEDREAM_ACCESS_TOKEN", "your_access_token")
        )
    )
    
    try:
        # Example: Send a Slack message (requires connected Slack account)
        result = client.run_action({
            "external_user_id": "demo_user_123",
            "action_id": "slack-send-message",
            "configured_props": {
                "channel": "#general",
                "text": "Hello from Pipedream Python SDK!"
            }
        })
        
        print(f"Action executed successfully!")
        print(f"Exports: {result.exports}")
        print(f"Return value: {result.ret}")
        
    except Exception as e:
        print(f"Error running action: {e}")
        print("Note: This requires a connected Slack account")


def trigger_example():
    """Example of deploying and managing triggers."""
    print("\n=== Trigger Example ===")
    
    client = create_client(
        project_id=os.getenv("PIPEDREAM_PROJECT_ID", "your_project_id"),
        credentials=AccessTokenCredentials(
            access_token=os.getenv("PIPEDREAM_ACCESS_TOKEN", "your_access_token")
        )
    )
    
    try:
        # Deploy a trigger
        trigger = client.deploy_trigger({
            "external_user_id": "demo_user_123",
            "trigger_id": "http-new-requests",  # Simple HTTP trigger
            "configured_props": {},
            "webhook_url": "https://yourapp.com/webhook"
        })
        
        print(f"Trigger deployed: {trigger.id}")
        print(f"Trigger name: {trigger.name}")
        print(f"Active: {trigger.active}")
        
        # Get trigger events
        events = client.get_trigger_events({
            "id": trigger.id,
            "external_user_id": "demo_user_123",
            "limit": 5
        })
        
        print(f"Found {len(events)} events")
        
        # Update trigger to inactive
        client.update_trigger({
            "id": trigger.id,
            "external_user_id": "demo_user_123",
            "active": False
        })
        
        print("Trigger updated to inactive")
        
        # Delete the trigger
        client.delete_trigger({
            "id": trigger.id,
            "external_user_id": "demo_user_123"
        })
        
        print("Trigger deleted")
        
    except Exception as e:
        print(f"Error with trigger operations: {e}")


def workflow_example():
    """Example of invoking workflows."""
    print("\n=== Workflow Example ===")
    
    client = create_client(
        project_id=os.getenv("PIPEDREAM_PROJECT_ID", "your_project_id"),
        credentials=AccessTokenCredentials(
            access_token=os.getenv("PIPEDREAM_ACCESS_TOKEN", "your_access_token")
        )
    )
    
    workflow_url = os.getenv("PIPEDREAM_WORKFLOW_URL", "https://your-workflow.m.pipedream.net")
    
    try:
        # Invoke workflow without authentication
        response = client.invoke_workflow(
            workflow_url,
            data={"message": "Hello from Python SDK", "timestamp": "2024-01-01T00:00:00Z"},
            auth_type=HTTPAuthType.NONE
        )
        
        print(f"Workflow response: {response}")
        
        # Invoke workflow for specific user with OAuth
        response = client.invoke_workflow_for_external_user(
            workflow_url,
            external_user_id="demo_user_123",
            data={"user_action": "login", "user_id": "demo_user_123"}
        )
        
        print(f"User-specific workflow response: {response}")
        
    except Exception as e:
        print(f"Error invoking workflow: {e}")
        print("Note: This requires a valid workflow URL")


if __name__ == "__main__":
    # Check for required environment variables
    required_env_vars = ["PIPEDREAM_PROJECT_ID"]
    
    missing_vars = [var for var in required_env_vars if not os.getenv(var)]
    
    if missing_vars:
        print("Missing required environment variables:")
        for var in missing_vars:
            print(f"  - {var}")
        print("\nPlease set these environment variables and try again.")
        print("You can also modify the script to use hardcoded values for testing.")
    else:
        print("Running basic Pipedream SDK examples...")
        main()
        
        # Uncomment to run more advanced examples
        # action_example()
        # trigger_example()
        # workflow_example() 