#!/usr/bin/env python3
"""
Simple test script to validate the Pipedream Python SDK.
"""

def test_imports():
    """Test that all imports work correctly."""
    print("Testing imports...")
    
    try:
        from pipedream_sdk import create_client, PipedreamClient
        from pipedream_sdk.types import (
            OAuthCredentials,
            AccessTokenCredentials,
            ProjectEnvironment,
            AppAuthType,
            ComponentType,
            HTTPAuthType,
        )
        print("✓ All imports successful")
        return True
    except ImportError as e:
        print(f"✗ Import failed: {e}")
        return False


def test_client_creation():
    """Test creating client instances."""
    print("\nTesting client creation...")
    
    try:
        from pipedream_sdk import create_client
        from pipedream_sdk.types import OAuthCredentials, AccessTokenCredentials, ProjectEnvironment
        
        # Test OAuth credentials
        oauth_creds = OAuthCredentials(
            client_id="test_client_id",
            client_secret="test_client_secret"
        )
        
        oauth_client = create_client(
            project_id="test_project",
            credentials=oauth_creds,
            environment=ProjectEnvironment.DEVELOPMENT
        )
        
        print(f"✓ OAuth client created: {oauth_client.version}")
        
        # Test access token credentials
        token_creds = AccessTokenCredentials(access_token="test_token")
        
        token_client = create_client(
            project_id="test_project",
            credentials=token_creds,
            environment="production"
        )
        
        print(f"✓ Token client created: {token_client.version}")
        return True
        
    except Exception as e:
        print(f"✗ Client creation failed: {e}")
        return False


def test_type_definitions():
    """Test type definitions and enums."""
    print("\nTesting type definitions...")
    
    try:
        from pipedream_sdk.types import (
            AppAuthType,
            ComponentType,
            HTTPAuthType,
            ConnectTokenCreateOpts,
            ComponentId,
        )
        
        # Test enums
        assert AppAuthType.OAUTH.value == "oauth"
        assert ComponentType.ACTION.value == "action"
        assert HTTPAuthType.NONE.value == "none"
        print("✓ Enums working correctly")
        
        # Test dataclasses
        opts = ConnectTokenCreateOpts(
            external_user_id="user123",
            success_redirect_uri="https://example.com/success"
        )
        assert opts.external_user_id == "user123"
        assert opts.success_redirect_uri == "https://example.com/success"
        print("✓ Dataclasses working correctly")
        
        component_id = ComponentId(key="slack-send-message")
        assert component_id.key == "slack-send-message"
        print("✓ ComponentId working correctly")
        
        return True
        
    except Exception as e:
        print(f"✗ Type definition test failed: {e}")
        return False


def test_oauth_module():
    """Test OAuth module functionality."""
    print("\nTesting OAuth module...")
    
    try:
        from pipedream_sdk.oauth import OAuth2Client, CachedOAuthToken
        from pipedream_sdk.types import OAuthCredentials
        
        creds = OAuthCredentials(
            client_id="test_client",
            client_secret="test_secret"
        )
        
        oauth_client = OAuth2Client(creds, "https://api.pipedream.com")
        print("✓ OAuth2Client created successfully")
        
        # Note: We won't actually make requests in this test
        cached_token = CachedOAuthToken(oauth_client)
        print("✓ CachedOAuthToken created successfully")
        
        return True
        
    except Exception as e:
        print(f"✗ OAuth module test failed: {e}")
        return False


def test_method_signatures():
    """Test that client methods have correct signatures."""
    print("\nTesting method signatures...")
    
    try:
        from pipedream_sdk import create_client
        from pipedream_sdk.types import AccessTokenCredentials
        
        client = create_client(
            project_id="test",
            credentials=AccessTokenCredentials(access_token="test")
        )
        
        # Test that methods exist and are callable
        methods_to_test = [
            'create_connect_token',
            'get_accounts',
            'get_account_by_id',
            'delete_account',
            'get_apps',
            'get_app',
            'get_components',
            'get_component',
            'configure_component',
            'run_action',
            'deploy_trigger',
            'delete_trigger',
            'get_trigger',
            'get_triggers',
            'update_trigger',
            'invoke_workflow',
            'make_proxy_request',
        ]
        
        for method_name in methods_to_test:
            method = getattr(client, method_name, None)
            if method is None:
                print(f"✗ Method {method_name} not found")
                return False
            if not callable(method):
                print(f"✗ Method {method_name} is not callable")
                return False
        
        print(f"✓ All {len(methods_to_test)} methods found and callable")
        return True
        
    except Exception as e:
        print(f"✗ Method signature test failed: {e}")
        return False


def main():
    """Run all tests."""
    print("Pipedream Python SDK Test Suite")
    print("=" * 40)
    
    tests = [
        test_imports,
        test_client_creation,
        test_type_definitions,
        test_oauth_module,
        test_method_signatures,
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print(f"\n" + "=" * 40)
    print(f"Test Results: {passed}/{total} passed")
    
    if passed == total:
        print("🎉 All tests passed! The SDK is working correctly.")
        return True
    else:
        print("❌ Some tests failed. Please check the output above.")
        return False


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1) 