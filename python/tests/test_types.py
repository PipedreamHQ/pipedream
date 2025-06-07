"""
Tests for the types module.
"""

import unittest
from pipedream_sdk.types import (
    AppAuthType,
    ComponentType,
    HTTPAuthType,
    ProjectEnvironment,
    OAuthCredentials,
    AccessTokenCredentials,
    AppInfo,
    App,
    ConnectTokenCreateOpts,
    ComponentId,
)


class TestTypes(unittest.TestCase):
    """Test case for type definitions."""
    
    def test_enums(self):
        """Test enum values."""
        self.assertEqual(AppAuthType.OAUTH.value, "oauth")
        self.assertEqual(AppAuthType.KEYS.value, "keys")
        self.assertEqual(AppAuthType.NONE.value, "none")
        
        self.assertEqual(ComponentType.TRIGGER.value, "trigger")
        self.assertEqual(ComponentType.ACTION.value, "action")
        
        self.assertEqual(HTTPAuthType.NONE.value, "none")
        self.assertEqual(HTTPAuthType.OAUTH.value, "oauth")
        
        self.assertEqual(ProjectEnvironment.DEVELOPMENT.value, "development")
        self.assertEqual(ProjectEnvironment.PRODUCTION.value, "production")
    
    def test_credentials(self):
        """Test credential dataclasses."""
        oauth_creds = OAuthCredentials(
            client_id="test_client_id",
            client_secret="test_client_secret"
        )
        self.assertEqual(oauth_creds.client_id, "test_client_id")
        self.assertEqual(oauth_creds.client_secret, "test_client_secret")
        
        access_token_creds = AccessTokenCredentials(
            access_token="test_access_token"
        )
        self.assertEqual(access_token_creds.access_token, "test_access_token")
    
    def test_app_info(self):
        """Test AppInfo dataclass."""
        app_info = AppInfo(name_slug="slack", id="app123")
        self.assertEqual(app_info.name_slug, "slack")
        self.assertEqual(app_info.id, "app123")
        
        # Test with optional id
        app_info_no_id = AppInfo(name_slug="github")
        self.assertEqual(app_info_no_id.name_slug, "github")
        self.assertIsNone(app_info_no_id.id)
    
    def test_app(self):
        """Test App dataclass."""
        app = App(
            name_slug="slack",
            id="app123",
            name="Slack",
            auth_type=AppAuthType.OAUTH,
            img_src="https://example.com/slack.png",
            custom_fields_json="{}",
            categories=["communication"],
            featured_weight=100
        )
        self.assertEqual(app.name_slug, "slack")
        self.assertEqual(app.name, "Slack")
        self.assertEqual(app.auth_type, AppAuthType.OAUTH)
        self.assertEqual(app.categories, ["communication"])
    
    def test_connect_token_opts(self):
        """Test ConnectTokenCreateOpts dataclass."""
        opts = ConnectTokenCreateOpts(
            external_user_id="user123",
            success_redirect_uri="https://example.com/success",
            error_redirect_uri="https://example.com/error"
        )
        self.assertEqual(opts.external_user_id, "user123")
        self.assertEqual(opts.success_redirect_uri, "https://example.com/success")
        self.assertEqual(opts.error_redirect_uri, "https://example.com/error")
    
    def test_component_id(self):
        """Test ComponentId dataclass."""
        component_id = ComponentId(key="slack-send-message")
        self.assertEqual(component_id.key, "slack-send-message")


if __name__ == "__main__":
    unittest.main() 