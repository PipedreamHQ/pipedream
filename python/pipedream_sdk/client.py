"""
Pipedream SDK Client implementation.
"""

import json
import urllib.request
import urllib.parse
import urllib.error
from typing import Any, Dict, List, Optional, Union

from .types import (
    Account,
    App,
    AppInfo,
    Component,
    ComponentId,
    ConfigureComponentOpts,
    ConfigureComponentResponse,
    ConnectTokenCreateOpts,
    ConnectTokenResponse,
    Credentials,
    DeployTriggerOpts,
    DeployedComponent,
    DeleteTriggerOpts,
    EmittedEvent,
    GetAccountByIdOpts,
    GetAccountOpts,
    GetAppsOpts,
    GetComponentsOpts,
    GetTriggerEventsOpts,
    GetTriggerOpts,
    GetTriggersOpts,
    HTTPAuthType,
    OAuthCredentials,
    AccessTokenCredentials,
    ProjectEnvironment,
    ProxyApiOpts,
    ProxyTargetApiRequest,
    ProxyResponse,
    ReloadComponentPropsOpts,
    RunActionOpts,
    RunActionResponse,
    UpdateTriggerOpts,
    UpdateTriggerWorkflowsOpts,
    UpdateTriggerWebhooksOpts,
)
from .oauth import OAuth2Client, CachedOAuthToken


class PipedreamClient:
    """Python client for the Pipedream Connect API."""
    
    def __init__(
        self,
        project_id: str,
        credentials: Credentials,
        environment: Union[ProjectEnvironment, str] = ProjectEnvironment.PRODUCTION,
        api_host: str = "api.pipedream.com",
        workflow_domain: str = "eoddfs92qn82e6o.m.pipedream.net",
    ):
        """Initialize the Pipedream client.
        
        Args:
            project_id: Your Pipedream project ID
            credentials: Either OAuth credentials or access token credentials
            environment: The environment (development or production)
            api_host: API host URL (default: api.pipedream.com)
            workflow_domain: Workflow domain for custom domains
        """
        self.project_id = project_id
        self.environment = environment.value if isinstance(environment, ProjectEnvironment) else environment
        self.api_host = api_host
        self.workflow_domain = workflow_domain
        self.base_api_url = f"https://{api_host}/v1"
        self.version = "1.6.0"
        
        # Initialize authentication
        self._setup_auth(credentials)
    
    def _setup_auth(self, credentials: Credentials) -> None:
        """Setup authentication based on credential type."""
        if isinstance(credentials, OAuthCredentials):
            oauth_client = OAuth2Client(credentials, self.api_host)
            self._oauth_token_manager = CachedOAuthToken(oauth_client)
            self._static_access_token = None
        elif isinstance(credentials, AccessTokenCredentials):
            self._oauth_token_manager = None
            self._static_access_token = credentials.access_token
        else:
            raise ValueError("Invalid credentials type. Must be OAuthCredentials or AccessTokenCredentials")
    
    def _get_auth_header(self) -> str:
        """Get the authorization header value."""
        if self._oauth_token_manager:
            token = self._oauth_token_manager.get_valid_token()
            return f"Bearer {token}"
        elif self._static_access_token:
            return f"Bearer {self._static_access_token}"
        else:
            raise ValueError("No valid authentication configured")
    
    def _make_request(
        self,
        method: str,
        path: str,
        params: Optional[Dict[str, Any]] = None,
        data: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None,
        authenticated: bool = True,
    ) -> Any:
        """Make an HTTP request to the Pipedream API.
        
        Args:
            method: HTTP method (GET, POST, etc.)
            path: API path (without base URL)
            params: Query parameters
            data: Request body data
            headers: Additional headers
            authenticated: Whether to include authentication
            
        Returns:
            Parsed JSON response
            
        Raises:
            Exception: If request fails
        """
        # Build URL
        url = f"{self.base_api_url}{path}"
        if params:
            # Filter out None values and convert to strings
            clean_params = {k: str(v) for k, v in params.items() if v is not None}
            url += "?" + urllib.parse.urlencode(clean_params)
        
        # Prepare headers
        req_headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": f"pipedream-python-sdk/{self.version}",
            "X-PD-SDK-Version": self.version,
            "X-PD-Environment": self.environment,
        }
        
        if authenticated:
            req_headers["Authorization"] = self._get_auth_header()
        
        if headers:
            req_headers.update(headers)
        
        # Prepare request body
        req_data = None
        if data is not None:
            req_data = json.dumps(data).encode('utf-8')
        
        # Create request
        req = urllib.request.Request(
            url,
            data=req_data,
            headers=req_headers,
            method=method
        )
        
        try:
            with urllib.request.urlopen(req) as response:
                response_body = response.read().decode('utf-8')
                
                if response.status >= 200 and response.status < 300:
                    if response_body:
                        return json.loads(response_body)
                    return None
                else:
                    error_data = json.loads(response_body) if response_body else {}
                    raise Exception(f"API request failed with status {response.status}: {error_data}")
                    
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            try:
                error_data = json.loads(error_body)
                raise Exception(f"API request failed: {error_data}")
            except json.JSONDecodeError:
                raise Exception(f"API request failed with status {e.code}: {error_body}")
        except Exception as e:
            raise Exception(f"Request failed: {str(e)}")
    
    def _add_relation_opts(self, params: Dict[str, Any], limit: Optional[int] = None, after: Optional[str] = None, before: Optional[str] = None) -> Dict[str, Any]:
        """Add pagination parameters to request params."""
        if limit is not None:
            params["limit"] = limit
        if after is not None:
            params["after"] = after
        if before is not None:
            params["before"] = before
        return params
    
    # Connect Token Methods
    
    def create_connect_token(self, opts: Union[ConnectTokenCreateOpts, Dict[str, Any]]) -> ConnectTokenResponse:
        """Create a Connect token for user authentication.
        
        Args:
            opts: Options for creating the token (dataclass or dict)
            
        Returns:
            Connect token response with token and URLs
        """
        # Convert dict to dataclass if needed
        if isinstance(opts, dict):
            opts = ConnectTokenCreateOpts(**opts)
            
        data = {
            "external_id": opts.external_user_id,  # API expects external_id, not external_user_id
        }
        
        if opts.success_redirect_uri:
            data["success_redirect_uri"] = opts.success_redirect_uri
        if opts.error_redirect_uri:
            data["error_redirect_uri"] = opts.error_redirect_uri
        if opts.webhook_uri:
            data["webhook_uri"] = opts.webhook_uri
        if opts.allowed_origins:
            data["allowed_origins"] = opts.allowed_origins
        
        response = self._make_connect_request("POST", "/tokens", data=data)
        return ConnectTokenResponse(**response)
    
    # Account Methods
    
    def get_accounts(self, opts: Optional[Union[GetAccountOpts, Dict[str, Any]]] = None) -> List[Account]:
        """Get connected accounts.
        
        Args:
            opts: Optional filtering and pagination options (dataclass or dict)
            
        Returns:
            List of accounts
        """
        params = {}
        if opts:
            # Convert dict to dataclass if needed
            if isinstance(opts, dict):
                opts = GetAccountOpts(**opts)
                
            if opts.app:
                params["app"] = opts.app
            if opts.oauth_app_id:
                params["oauth_app_id"] = opts.oauth_app_id
            if opts.include_credentials is not None:
                params["include_credentials"] = opts.include_credentials
            if opts.external_user_id:
                params["external_user_id"] = opts.external_user_id
            
            self._add_relation_opts(params, opts.limit, opts.after, opts.before)
        
        response = self._make_connect_request("GET", "/accounts", params=params)
        return [Account(**account) for account in response.get("data", [])]
    
    def get_account_by_id(self, account_id: str, opts: Optional[Union[GetAccountByIdOpts, Dict[str, Any]]] = None) -> Account:
        """Get a specific account by ID.
        
        Args:
            account_id: The account ID
            opts: Optional parameters (dataclass or dict)
            
        Returns:
            Account object
        """
        params = {}
        if opts:
            # Convert dict to dataclass if needed
            if isinstance(opts, dict):
                opts = GetAccountByIdOpts(**opts)
                
            if opts.include_credentials is not None:
                params["include_credentials"] = opts.include_credentials
        
        response = self._make_connect_request("GET", f"/accounts/{account_id}", params=params)
        return Account(**response["data"])
    
    def delete_account(self, account_id: str) -> None:
        """Delete an account.
        
        Args:
            account_id: The account ID to delete
        """
        self._make_connect_request("DELETE", f"/accounts/{account_id}")
    
    def delete_accounts_by_app(self, app_id: str) -> None:
        """Delete all accounts for a specific app.
        
        Args:
            app_id: The app ID
        """
        self._make_connect_request("DELETE", f"/accounts/app/{app_id}")
    
    def delete_external_user(self, external_id: str) -> None:
        """Delete all accounts for an external user.
        
        Args:
            external_id: The external user ID
        """
        self._make_connect_request("DELETE", f"/users/{external_id}")
    
    # App Methods
    
    def get_apps(self, opts: Optional[Union[GetAppsOpts, Dict[str, Any]]] = None) -> List[App]:
        """Get available apps.
        
        Args:
            opts: Optional filtering and pagination options (dataclass or dict)
            
        Returns:
            List of apps
        """
        params = {}
        if opts:
            # Convert dict to dataclass if needed
            if isinstance(opts, dict):
                opts = GetAppsOpts(**opts)
                
            if opts.q:
                params["q"] = opts.q
            if opts.has_actions is not None:
                params["has_actions"] = "1" if opts.has_actions else "0"
            if opts.has_components is not None:
                params["has_components"] = "1" if opts.has_components else "0"
            if opts.has_triggers is not None:
                params["has_triggers"] = "1" if opts.has_triggers else "0"
            
            self._add_relation_opts(params, opts.limit, opts.after, opts.before)
        
        response = self._make_request("GET", "/apps", params=params)
        return [App(**app) for app in response.get("data", [])]
    
    def get_app(self, id_or_name_slug: str) -> App:
        """Get a specific app by ID or name slug.
        
        Args:
            id_or_name_slug: App ID or name slug
            
        Returns:
            App object
        """
        response = self._make_request("GET", f"/apps/{id_or_name_slug}")
        return App(**response["data"])
    
    # Component Methods
    
    def get_components(self, opts: Optional[Union[GetComponentsOpts, Dict[str, Any]]] = None) -> List[Component]:
        """Get available components.
        
        Args:
            opts: Optional filtering and pagination options (dataclass or dict)
            
        Returns:
            List of components
        """
        params = {}
        if opts:
            # Convert dict to dataclass if needed
            if isinstance(opts, dict):
                opts = GetComponentsOpts(**opts)
                
            if opts.q:
                params["q"] = opts.q
            if opts.app:
                params["app"] = opts.app
            if opts.component_type:
                params["componentType"] = opts.component_type.value
            
            self._add_relation_opts(params, opts.limit, opts.after, opts.before)
        
        response = self._make_connect_request("GET", "/components", params=params)
        return [Component(**component) for component in response.get("data", [])]
    
    def get_component(self, component_id: Union[str, ComponentId]) -> Component:
        """Get a specific component.
        
        Args:
            component_id: Component identifier (string or ComponentId)
            
        Returns:
            Component object
        """
        key = component_id.key if isinstance(component_id, ComponentId) else component_id
        response = self._make_connect_request("GET", f"/components/{key}")
        return Component(**response["data"])
    
    def configure_component(self, opts: Union[ConfigureComponentOpts, Dict[str, Any]]) -> ConfigureComponentResponse:
        """Configure a component prop.
        
        Args:
            opts: Configuration options (dataclass or dict)
            
        Returns:
            Configuration response
        """
        # Convert dict to dataclass if needed
        if isinstance(opts, dict):
            opts = ConfigureComponentOpts(**opts)
            
        component_key = opts.component_id.key if isinstance(opts.component_id, ComponentId) else opts.component_id
        
        data = {
            "external_user_id": opts.external_user_id,
            "id": component_key,
            "prop_name": opts.prop_name,
            "configured_props": opts.configured_props,
        }
        
        if opts.dynamic_props_id:
            data["dynamic_props_id"] = opts.dynamic_props_id
        if opts.query:
            data["query"] = opts.query
        if opts.page is not None:
            data["page"] = opts.page
        if opts.prev_context:
            data["prev_context"] = opts.prev_context
        
        response = self._make_connect_request("POST", "/components/configure", data=data)
        return ConfigureComponentResponse(
            options=response.get("options", []),
            string_options=response.get("stringOptions", []),
            errors=response.get("errors", []),
            context=response.get("context")
        )
    
    def reload_component_props(self, opts: ReloadComponentPropsOpts) -> Dict[str, Any]:
        """Reload component props.
        
        Args:
            opts: Reload options
            
        Returns:
            Reloaded props response
        """
        component_key = opts.component_id.key if isinstance(opts.component_id, ComponentId) else opts.component_id
        
        data = {
            "external_user_id": opts.external_user_id,
            "id": component_key,
            "configured_props": opts.configured_props,
        }
        
        if opts.dynamic_props_id:
            data["dynamic_props_id"] = opts.dynamic_props_id
        
        return self._make_connect_request("POST", "/components/props", data=data)
    
    # Action Methods
    
    def run_action(self, opts: Union[RunActionOpts, Dict[str, Any]]) -> RunActionResponse:
        """Run an action.
        
        Args:
            opts: Action run options (dataclass or dict)
            
        Returns:
            Action run response
        """
        # Convert dict to dataclass if needed
        if isinstance(opts, dict):
            opts = RunActionOpts(**opts)
            
        action_key = opts.action_id.key if isinstance(opts.action_id, ComponentId) else opts.action_id
        
        data = {
            "external_user_id": opts.external_user_id,
            "id": action_key,
            "configured_props": opts.configured_props,
        }
        
        if opts.dynamic_props_id:
            data["dynamic_props_id"] = opts.dynamic_props_id
        
        response = self._make_connect_request("POST", "/actions/run", data=data)
        return RunActionResponse(**response)
    
    # Trigger Methods
    
    def deploy_trigger(self, opts: Union[DeployTriggerOpts, Dict[str, Any]]) -> DeployedComponent:
        """Deploy a trigger.
        
        Args:
            opts: Deploy options (dataclass or dict)
            
        Returns:
            Deployed trigger
        """
        # Convert dict to dataclass if needed
        if isinstance(opts, dict):
            opts = DeployTriggerOpts(**opts)
            
        trigger_key = opts.trigger_id.key if isinstance(opts.trigger_id, ComponentId) else opts.trigger_id
        
        data = {
            "external_user_id": opts.external_user_id,
            "id": trigger_key,
            "configured_props": opts.configured_props,
        }
        
        if opts.dynamic_props_id:
            data["dynamic_props_id"] = opts.dynamic_props_id
        if opts.webhook_url:
            data["webhook_url"] = opts.webhook_url
        
        response = self._make_connect_request("POST", "/triggers/deploy", data=data)
        return DeployedComponent(**response["data"])
    
    def delete_trigger(self, opts: DeleteTriggerOpts) -> None:
        """Delete a deployed trigger.
        
        Args:
            opts: Delete options
        """
        params = {
            "external_user_id": opts.external_user_id,
        }
        
        if opts.ignore_hook_errors is not None:
            params["ignore_hook_errors"] = opts.ignore_hook_errors
        
        self._make_connect_request("DELETE", f"/deployed-triggers/{opts.id}", params=params)
    
    def get_trigger(self, opts: GetTriggerOpts) -> DeployedComponent:
        """Get a deployed trigger.
        
        Args:
            opts: Get options
            
        Returns:
            Deployed trigger
        """
        params = {
            "external_user_id": opts.external_user_id,
        }
        
        response = self._make_connect_request("GET", f"/deployed-triggers/{opts.id}", params=params)
        return DeployedComponent(**response["data"])
    
    def get_triggers(self, opts: GetTriggersOpts) -> List[DeployedComponent]:
        """Get deployed triggers.
        
        Args:
            opts: Get options
            
        Returns:
            List of deployed triggers
        """
        params = {
            "external_user_id": opts.external_user_id,
        }
        
        self._add_relation_opts(params, opts.limit, opts.after, opts.before)
        
        response = self._make_connect_request("GET", "/deployed-triggers", params=params)
        return [DeployedComponent(**trigger) for trigger in response.get("data", [])]
    
    def update_trigger(self, opts: UpdateTriggerOpts) -> DeployedComponent:
        """Update a deployed trigger.
        
        Args:
            opts: Update options
            
        Returns:
            Updated trigger
        """
        params = {
            "external_user_id": opts.external_user_id,
        }
        
        data = {}
        if opts.active is not None:
            data["active"] = opts.active
        if opts.configured_props:
            data["configured_props"] = opts.configured_props
        if opts.name:
            data["name"] = opts.name
        
        response = self._make_connect_request("PUT", f"/deployed-triggers/{opts.id}", params=params, data=data)
        return DeployedComponent(**response["data"])
    
    def get_trigger_events(self, opts: GetTriggerEventsOpts) -> List[EmittedEvent]:
        """Get events emitted by a trigger.
        
        Args:
            opts: Get events options
            
        Returns:
            List of emitted events
        """
        params = {
            "external_user_id": opts.external_user_id,
        }
        
        if opts.limit:
            params["n"] = opts.limit
        
        response = self._make_connect_request("GET", f"/deployed-triggers/{opts.id}/events", params=params)
        return [EmittedEvent(**event) for event in response.get("data", [])]
    
    def get_trigger_workflows(self, opts: GetTriggerOpts) -> List[str]:
        """Get workflow IDs listening to a trigger.
        
        Args:
            opts: Get options
            
        Returns:
            List of workflow IDs
        """
        params = {
            "external_user_id": opts.external_user_id,
        }
        
        response = self._make_connect_request("GET", f"/deployed-triggers/{opts.id}/workflows", params=params)
        return response.get("workflow_ids", [])
    
    def update_trigger_workflows(self, opts: UpdateTriggerWorkflowsOpts) -> None:
        """Update workflow IDs listening to a trigger.
        
        Args:
            opts: Update options
        """
        params = {
            "external_user_id": opts.external_user_id,
        }
        
        data = {
            "workflow_ids": opts.workflow_ids,
        }
        
        self._make_connect_request("PUT", f"/deployed-triggers/{opts.id}/workflows", params=params, data=data)
    
    def get_trigger_webhooks(self, opts: GetTriggerOpts) -> List[str]:
        """Get webhook URLs listening to a trigger.
        
        Args:
            opts: Get options
            
        Returns:
            List of webhook URLs
        """
        params = {
            "external_user_id": opts.external_user_id,
        }
        
        response = self._make_connect_request("GET", f"/deployed-triggers/{opts.id}/webhooks", params=params)
        return response.get("webhook_urls", [])
    
    def update_trigger_webhooks(self, opts: UpdateTriggerWebhooksOpts) -> None:
        """Update webhook URLs listening to a trigger.
        
        Args:
            opts: Update options
        """
        params = {
            "external_user_id": opts.external_user_id,
        }
        
        data = {
            "webhook_urls": opts.webhook_urls,
        }
        
        self._make_connect_request("PUT", f"/deployed-triggers/{opts.id}/webhooks", params=params, data=data)
    
    # Project Methods
    
    def get_project_info(self) -> Dict[str, Any]:
        """Get project information.
        
        Returns:
            Project info including linked apps
        """
        return self._make_connect_request("GET", "")
    
    # Proxy API Methods
    
    def make_proxy_request(self, proxy_opts: ProxyApiOpts, target_request: ProxyTargetApiRequest) -> ProxyResponse:
        """Make a proxy request on behalf of a user.
        
        Args:
            proxy_opts: Proxy options with search params
            target_request: Target API request details
            
        Returns:
            Proxy response (parsed JSON or string)
        """
        data = {
            "targetRequest": {
                "url": target_request.url,
                "options": {
                    "method": target_request.options.method,
                }
            }
        }
        
        if target_request.options.headers:
            data["targetRequest"]["options"]["headers"] = target_request.options.headers
        if target_request.options.body:
            data["targetRequest"]["options"]["body"] = target_request.options.body
        
        response = self._make_request("POST", "/v1/connect/proxy", params=proxy_opts.search_params, data=data)
        return response
    
    # Workflow Methods
    
    def invoke_workflow(
        self,
        url_or_endpoint: str,
        data: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None,
        auth_type: HTTPAuthType = HTTPAuthType.NONE,
    ) -> Any:
        """Invoke a workflow.
        
        Args:
            url_or_endpoint: Full URL or endpoint path
            data: Request body data
            headers: Additional headers
            auth_type: Authentication type
            
        Returns:
            Workflow response
        """
        # Build the full URL if only endpoint provided
        if not url_or_endpoint.startswith("http"):
            url = f"https://{self.workflow_domain}/{url_or_endpoint}"
        else:
            url = url_or_endpoint
        
        # Prepare headers
        req_headers = headers or {}
        
        if auth_type == HTTPAuthType.OAUTH:
            req_headers["Authorization"] = self._get_auth_header()
        elif auth_type == HTTPAuthType.STATIC_BEARER:
            # Assume the bearer token is provided in headers
            pass
        
        # Make the request using urllib
        req_data = None
        if data is not None:
            req_data = json.dumps(data).encode('utf-8')
            req_headers["Content-Type"] = "application/json"
        
        req = urllib.request.Request(
            url,
            data=req_data,
            headers=req_headers,
            method="POST"
        )
        
        try:
            with urllib.request.urlopen(req) as response:
                response_body = response.read().decode('utf-8')
                
                if response_body:
                    try:
                        return json.loads(response_body)
                    except json.JSONDecodeError:
                        return response_body
                return None
                
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            raise Exception(f"Workflow invocation failed: {error_body}")
        except Exception as e:
            raise Exception(f"Workflow invocation failed: {str(e)}")
    
    def invoke_workflow_for_external_user(
        self,
        url: str,
        external_user_id: str,
        data: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> Any:
        """Invoke a workflow for a specific external user.
        
        Args:
            url: Workflow URL
            external_user_id: External user ID
            data: Request body data
            headers: Additional headers
            
        Returns:
            Workflow response
        """
        # Add external user ID to headers
        req_headers = headers or {}
        req_headers["x-pd-external-user-id"] = external_user_id
        
        return self.invoke_workflow(url, data, req_headers, HTTPAuthType.OAUTH)

    def _make_connect_request(
        self,
        method: str,
        path: str,
        params: Optional[Dict[str, Any]] = None,
        data: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> Any:
        """Make a request to the Connect API with proper path structure.
        
        Args:
            method: HTTP method
            path: Endpoint path (without /connect/{projectId})
            params: Query parameters
            data: Request body data
            headers: Additional headers
            
        Returns:
            Parsed JSON response
        """
        # Build the full Connect API path
        full_path = "/connect"
        if self.project_id:
            full_path += f"/{self.project_id}"
        full_path += path
        
        return self._make_request(method, full_path, params, data, headers, True)


def create_client(
    project_id: str,
    credentials: Credentials,
    environment: Union[ProjectEnvironment, str] = ProjectEnvironment.PRODUCTION,
    api_host: str = "api.pipedream.com",
    workflow_domain: str = "eoddfs92qn82e6o.m.pipedream.net",
) -> PipedreamClient:
    """Create a new Pipedream client instance.
    
    Args:
        project_id: Your Pipedream project ID
        credentials: Either OAuth credentials or access token credentials  
        environment: The environment (development or production)
        api_host: API host URL (default: api.pipedream.com)
        workflow_domain: Workflow domain for custom domains
        
    Returns:
        PipedreamClient instance
    """
    return PipedreamClient(
        project_id=project_id,
        credentials=credentials,
        environment=environment,
        api_host=api_host,
        workflow_domain=workflow_domain,
    ) 