"""
OAuth2 implementation for Pipedream SDK.
"""

import time
from typing import Optional, Dict, Any
import urllib.parse
import urllib.request
import json

from .types import OAuthCredentials


class OAuth2Client:
    """OAuth2 client for Pipedream API authentication."""
    
    def __init__(self, credentials: OAuthCredentials, token_host: str):
        """Initialize OAuth2 client.
        
        Args:
            credentials: OAuth credentials with client_id and client_secret
            token_host: The host URL for token requests
        """
        self.client_id = credentials.client_id
        self.client_secret = credentials.client_secret
        self.token_host = token_host
        self.token_endpoint = f"https://{token_host}/v1/oauth/token"
        
    def get_access_token(self) -> Dict[str, Any]:
        """Get an access token using client credentials grant.
        
        Returns:
            Dictionary containing access token and metadata
            
        Raises:
            Exception: If token request fails
        """
        data = {
            "grant_type": "client_credentials",
            "client_id": self.client_id,
            "client_secret": self.client_secret,
        }
        
        # Encode the data as URL-encoded form data
        encoded_data = urllib.parse.urlencode(data).encode('utf-8')
        
        # Create the request
        req = urllib.request.Request(
            self.token_endpoint,
            data=encoded_data,
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
            },
            method="POST"
        )
        
        try:
            with urllib.request.urlopen(req) as response:
                response_data = json.loads(response.read().decode('utf-8'))
                
                if response.status == 200:
                    return response_data
                else:
                    raise Exception(f"OAuth token request failed: {response_data}")
                    
        except urllib.error.HTTPError as e:
            error_response = json.loads(e.read().decode('utf-8'))
            raise Exception(f"OAuth token request failed: {error_response}")
        except Exception as e:
            raise Exception(f"OAuth token request failed: {str(e)}")


class CachedOAuthToken:
    """Manages OAuth token caching and refresh logic."""
    
    def __init__(self, oauth_client: OAuth2Client):
        """Initialize the cached token manager.
        
        Args:
            oauth_client: OAuth2 client for token requests
        """
        self.oauth_client = oauth_client
        self._token: Optional[str] = None
        self._expires_at: Optional[float] = None
        
    def get_valid_token(self) -> str:
        """Get a valid access token, refreshing if necessary.
        
        Returns:
            Valid access token string
        """
        current_time = time.time()
        
        # Check if we need to fetch/refresh the token
        if (self._token is None or 
            self._expires_at is None or 
            current_time >= self._expires_at - 60):  # Refresh 60 seconds before expiry
            
            self._refresh_token()
            
        return self._token
    
    def _refresh_token(self) -> None:
        """Refresh the access token."""
        token_response = self.oauth_client.get_access_token()
        
        self._token = token_response["access_token"]
        
        # Calculate expiration time
        expires_in = token_response.get("expires_in", 3600)  # Default to 1 hour
        self._expires_at = time.time() + expires_in
    
    def clear_token(self) -> None:
        """Clear the cached token."""
        self._token = None
        self._expires_at = None 