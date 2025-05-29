"""
Type definitions for the Pipedream SDK.
"""

from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional, Union
from dataclasses import dataclass


class AppAuthType(Enum):
    """The types of authentication that Pipedream apps support."""
    OAUTH = "oauth"
    KEYS = "keys"
    NONE = "none"


class ComponentType(Enum):
    """The type of component (trigger or action)."""
    TRIGGER = "trigger"
    ACTION = "action"


class HTTPAuthType(Enum):
    """HTTP authentication types for workflow invocation."""
    NONE = "none"
    STATIC_BEARER = "static_bearer_token"
    OAUTH = "oauth"


class ProjectEnvironment(Enum):
    """The environment in which the client is running."""
    DEVELOPMENT = "development"
    PRODUCTION = "production"


# Type aliases for component configuration
ConfigurableProps = Dict[str, Any]
ConfiguredProps = Dict[str, Any]


@dataclass
class AppInfo:
    """Basic ID information of a Pipedream app."""
    name_slug: str
    id: Optional[str] = None


@dataclass
class App:
    """App information."""
    id: Optional[str]
    name_slug: str
    name: str
    auth_type: str
    img_src: str
    custom_fields_json: str
    categories: List[str]
    featured_weight: int
    description: Optional[str] = None
    
    def __post_init__(self):
        """Convert string auth_type to enum."""
        if isinstance(self.auth_type, str):
            self.auth_type = AppAuthType(self.auth_type)


@dataclass
class Account:
    """Represents a connected account."""
    id: str
    name: str
    external_id: str
    healthy: bool
    dead: bool
    app: Dict[str, Any]  # Keep as dict initially, convert to App if needed
    created_at: str
    updated_at: str
    credentials: Optional[Dict[str, str]] = None


@dataclass
class ConnectTokenResponse:
    """Response from creating a Connect token."""
    token: str
    expires_at: str
    connect_link_url: str


@dataclass
class PropOption:
    """A configuration option for a component's prop."""
    label: str
    value: str


@dataclass
class ConfigureComponentResponse:
    """Response from configuring a component prop."""
    options: List[PropOption]
    string_options: List[str] 
    errors: List[str]
    context: Optional[Dict[str, Any]] = None


@dataclass
class ComponentId:
    """The ID of a component."""
    key: str


@dataclass
class Component:
    """Component information."""
    name: str
    description: str
    component_type: str
    key: str
    configurable_props: List[Dict[str, Any]]
    version: Optional[str] = None


@dataclass  
class DeployedComponent:
    """Represents a deployed component (trigger)."""
    id: str
    name: str
    component: Dict[str, Any]  # Keep as dict
    configured_props: ConfiguredProps
    active: bool
    created_at: str
    updated_at: str


@dataclass
class EmittedEvent:
    """Represents an event emitted by a trigger."""
    id: str
    data: Any
    emitted_at: str


@dataclass
class RunActionResponse:
    """Response from running an action."""
    exports: Any
    os: List[Any]
    ret: Any


@dataclass
class ResponsePageInfo:
    """Pagination information for API responses."""
    total_count: int
    count: int
    start_cursor: str
    end_cursor: str


@dataclass
class PaginationResponse:
    """Base pagination response."""
    page_info: ResponsePageInfo


@dataclass
class OAuthCredentials:
    """OAuth credentials for authentication."""
    client_id: str
    client_secret: str


@dataclass
class AccessTokenCredentials:
    """Access token credentials for authentication."""
    access_token: str


# Union type for credentials
Credentials = Union[OAuthCredentials, AccessTokenCredentials]


@dataclass
class ConnectTokenCreateOpts:
    """Options for creating a Connect token."""
    external_user_id: str
    success_redirect_uri: Optional[str] = None
    error_redirect_uri: Optional[str] = None
    webhook_uri: Optional[str] = None
    allowed_origins: Optional[List[str]] = None


@dataclass
class RelationOpts:
    """Pagination options for API requests."""
    after: Optional[str] = None
    before: Optional[str] = None
    limit: Optional[int] = None


@dataclass
class GetAccountOpts:
    """Options for getting accounts."""
    app: Optional[str] = None
    oauth_app_id: Optional[str] = None
    include_credentials: Optional[bool] = None
    external_user_id: Optional[str] = None
    after: Optional[str] = None
    before: Optional[str] = None
    limit: Optional[int] = None


@dataclass
class GetAccountByIdOpts:
    """Options for getting an account by ID."""
    include_credentials: Optional[bool] = None


@dataclass
class GetAppsOpts:
    """Options for getting apps."""
    q: Optional[str] = None
    has_actions: Optional[bool] = None
    has_components: Optional[bool] = None
    has_triggers: Optional[bool] = None
    after: Optional[str] = None
    before: Optional[str] = None
    limit: Optional[int] = None


@dataclass
class GetComponentsOpts:
    """Options for getting components."""
    q: Optional[str] = None
    app: Optional[str] = None
    component_type: Optional[ComponentType] = None
    after: Optional[str] = None
    before: Optional[str] = None
    limit: Optional[int] = None


@dataclass
class ConfigureComponentOpts:
    """Options for configuring a component prop."""
    external_user_id: str
    component_id: Union[str, ComponentId]
    prop_name: str
    configured_props: ConfiguredProps
    dynamic_props_id: Optional[str] = None
    query: Optional[str] = None
    page: Optional[int] = None
    prev_context: Optional[Dict[str, Any]] = None


@dataclass
class ReloadComponentPropsOpts:
    """Options for reloading component props."""
    external_user_id: str
    component_id: Union[str, ComponentId]
    configured_props: ConfiguredProps
    dynamic_props_id: Optional[str] = None


@dataclass
class RunActionOpts:
    """Options for running an action."""
    external_user_id: str
    action_id: Union[str, ComponentId]
    configured_props: ConfiguredProps
    dynamic_props_id: Optional[str] = None


@dataclass
class DeployTriggerOpts:
    """Options for deploying a trigger."""
    external_user_id: str
    trigger_id: Union[str, ComponentId]
    configured_props: ConfiguredProps
    dynamic_props_id: Optional[str] = None
    workflow_id: Optional[str] = None
    webhook_url: Optional[str] = None


@dataclass
class DeleteTriggerOpts:
    """Options for deleting a trigger."""
    id: str
    external_user_id: str
    ignore_hook_errors: Optional[bool] = None


@dataclass
class GetTriggerOpts:
    """Options for getting a trigger."""
    id: str
    external_user_id: str


@dataclass
class GetTriggerEventsOpts:
    """Options for getting trigger events."""
    id: str
    external_user_id: str
    limit: Optional[int] = None


@dataclass
class GetTriggersOpts:
    """Options for getting triggers."""
    external_user_id: str
    after: Optional[str] = None
    before: Optional[str] = None
    limit: Optional[int] = None


@dataclass
class UpdateTriggerOpts:
    """Options for updating a trigger."""
    id: str
    external_user_id: str
    active: Optional[bool] = None
    configured_props: Optional[ConfiguredProps] = None
    name: Optional[str] = None


@dataclass
class UpdateTriggerWorkflowsOpts:
    """Options for updating trigger workflows."""
    id: str
    external_user_id: str
    workflow_ids: List[str]


@dataclass
class UpdateTriggerWebhooksOpts:
    """Options for updating trigger webhooks."""
    id: str
    external_user_id: str
    webhook_urls: List[str]


@dataclass
class ProxyApiOpts:
    """Options for proxy API requests."""
    search_params: Dict[str, str]


@dataclass
class ProxyTargetApiOpts:
    """Options for proxy target API requests."""
    method: str
    headers: Optional[Dict[str, str]] = None
    body: Optional[str] = None


@dataclass
class ProxyTargetApiRequest:
    """Proxy target API request definition."""
    url: str
    options: ProxyTargetApiOpts


# Response types
ProxyResponse = Union[Dict[str, Any], str]


@dataclass
class ErrorResponse:
    """Error response from the API."""
    error: str


# Generic API response that can be either success or error
ConnectAPIResponse = Union[Any, ErrorResponse] 