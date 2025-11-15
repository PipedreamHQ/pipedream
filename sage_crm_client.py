import base64
import logging
import os
from datetime import datetime
from typing import Any, Optional
from urllib.parse import urljoin, urlparse

import requests

logger = logging.getLogger(__name__)

class SageCRMClient:
    """
    A client for interacting with Sage CRM's REST API.
    Handles authentication and provides methods for ticket management.

    Example:
        ```python
        from sage_crm_client import SageCRMClient
        import os

        client = SageCRMClient(
            base_url=os.getenv("SAGE_CRM_URL"),
            username=os.getenv("SAGE_CRM_USERNAME"),
            password=os.getenv("SAGE_CRM_PASSWORD")
        )
        ```
    """

    def __init__(self, base_url: str, username: str, password: str) -> None:
        """
        Initialize the Sage CRM client.
        
        Args:
            base_url: Base URL of your Sage CRM instance (e.g., 'https://your-company.crm.sage.com')
            username: Your Sage CRM username
            password: Your Sage CRM password
        """
        if not base_url:
            raise ValueError("base_url cannot be empty")
        
        parsed_url = urlparse(base_url)
        if not all([parsed_url.scheme, parsed_url.netloc]):
            raise ValueError(f"Invalid base_url: {base_url}. Must include scheme (http/https) and hostname.")
        
        if not username or not password:
            raise ValueError("Both username and password are required")

        self.base_url = base_url.rstrip('/')
        self.api_base = f"{self.base_url}/api"
        self.session = requests.Session()
        self._last_request_time = 0
        self._min_request_interval = 0.1  # 10 requests per second
        self._setup_auth(username, password)
    
    def _setup_auth(self, username: str, password: str) -> None:
        """Set up basic authentication."""
        credentials = f"{username}:{password}"
        encoded_credentials = base64.b64encode(credentials.encode('utf-8')).decode('utf-8')
        self.session.headers.update({
            'Authorization': f'Basic {encoded_credentials}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
    
    def _make_request(self, method: str, endpoint: str, **kwargs: Any) -> dict | list:
        """
        Make an API request and handle the response.

        Args:
            method: HTTP method (GET, POST, PUT, DELETE)
            endpoint: API endpoint path
            **kwargs: Additional arguments to pass to requests.Session.request()

        Returns:
            Parsed JSON response as a dictionary or list

        Raises:
            requests.exceptions.RequestException: If the request fails
            ValueError: If the response cannot be parsed as JSON
        """
        # Rate limiting
        self._enforce_rate_limit()
        
        url = urljoin(f"{self.api_base}/", endpoint.lstrip('/'))
        logger.debug(f"Making {method} request to {url}")
        
        try:
            response = self.session.request(method, url, **kwargs)
            
            # Handle specific error status codes
            if response.status_code == 401:
                raise AuthenticationError("Authentication failed. Please check your credentials.")
            elif response.status_code == 403:
                raise PermissionError("Insufficient permissions to access this resource.")
            elif response.status_code == 404:
                raise ResourceNotFoundError(f"Resource not found: {url}")
                
            response.raise_for_status()
            
            if not response.content:
                return {}
                
            try:
                return response.json()
            except ValueError as e:
                logger.error(f"Failed to parse JSON response: {e}")
                raise ValueError(f"Failed to parse JSON response: {e}")
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Error making {method} request to {url}: {str(e)}")
            raise
            
    def _enforce_rate_limit(self) -> None:
        """Enforce rate limiting by sleeping if needed."""
        current_time = datetime.now().timestamp()
        time_since_last = current_time - self._last_request_time
        
        if time_since_last < self._min_request_interval:
            sleep_time = self._min_request_interval - time_since_last
            import time
            time.sleep(sleep_time)
            
        self._last_request_time = datetime.now().timestamp()

    # Ticket Operations
    
    def get_tickets(self, query: str | None = None, **filters: Any) -> list[dict]:
        """
        Get a list of tickets, optionally filtered by query or other parameters.

        Example:
            ```python
            # Get all open tickets
            open_tickets = client.get_tickets(status="open")
            
            # Search for tickets
            tickets = client.get_tickets("urgent", priority="high")
            ```
            
        Args:
            query: Optional search query string
            **filters: Additional filter parameters (e.g., status='open', priority='high')
            
        Returns:
            List of ticket dictionaries
            
        Raises:
            requests.exceptions.RequestException: If the request fails
            ValueError: If the response cannot be parsed
        """
        params: dict[str, Any] = {}
        if query:
            params['query'] = query
        params.update(filters)

        response = self._make_request('GET', 'tickets', params=params)
        
        # Handle different possible response formats
        if isinstance(response, list):
            return response
        elif isinstance(response, dict) and 'tickets' in response:
            return response['tickets']
        elif isinstance(response, dict):
            return [response]
        return []
    
    def get_ticket(self, ticket_id: str | int) -> dict:
        """
        Get a specific ticket by ID.

        Example:
            ```python
            ticket = client.get_ticket("TICKET123")
            print(ticket['subject'])
            ```
            
        Args:
            ticket_id: The ID of the ticket to retrieve
            
        Returns:
            Ticket details as a dictionary
            
        Raises:
            ResourceNotFoundError: If the ticket is not found
            requests.exceptions.RequestException: If the request fails
        """
        if not ticket_id:
            raise ValueError("ticket_id cannot be empty")
            
        return self._make_request('GET', f'tickets/{ticket_id}')
    
    def create_ticket(self, ticket_data: dict) -> dict:
        """
        Create a new ticket.

        Example:
            ```python
            new_ticket = client.create_ticket({
                "subject": "API Test Ticket",
                "description": "This is a test ticket",
                "priority": "medium",
                "status": "open"
            })
            ```
            
        Args:
            ticket_data: Dictionary containing ticket details. Must include at least 'subject'.
            
        Returns:
            The created ticket details
            
        Raises:
            ValueError: If required fields are missing
            requests.exceptions.RequestException: If the request fails
        """
        if not ticket_data.get('subject'):
            raise ValueError("ticket_data must include a 'subject' field")
            
        return self._make_request('POST', 'tickets', json=ticket_data)
    
    def update_ticket(self, ticket_id: str | int, update_data: dict) -> dict:
        """
        Update an existing ticket.

        Example:
            ```python
            updated = client.update_ticket("TICKET123", {
                "status": "in_progress",
                "priority": "high"
            })
            ```
            
        Args:
            ticket_id: The ID of the ticket to update
            update_data: Dictionary containing fields to update
            
        Returns:
            The updated ticket details
            
        Raises:
            ValueError: If ticket_id is empty or update_data is empty
            ResourceNotFoundError: If the ticket is not found
            requests.exceptions.RequestException: If the request fails
        """
        if not ticket_id:
            raise ValueError("ticket_id cannot be empty")
        if not update_data:
            raise ValueError("update_data cannot be empty")
            
        return self._make_request('PUT', f'tickets/{ticket_id}', json=update_data)
    
    def delete_ticket(self, ticket_id: str | int) -> None:
        """
        Delete a ticket.

        Example:
            ```python
            client.delete_ticket("TICKET123")
            ```
            
        Args:
            ticket_id: The ID of the ticket to delete
            
        Returns:
            None if deletion was successful
            
        Raises:
            ValueError: If ticket_id is empty
            ResourceNotFoundError: If the ticket is not found
            requests.exceptions.RequestException: If the request fails
        """
        if not ticket_id:
            raise ValueError("ticket_id cannot be empty")
            
        self._make_request('DELETE', f'tickets/{ticket_id}')


class AuthenticationError(Exception):
    """Raised when authentication fails."""
    pass


class ResourceNotFoundError(Exception):
    """Raised when a requested resource is not found."""
    pass


def main() -> None:
    """Example usage of the SageCRMClient."""
    import logging
    
    # Set up logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    try:
        # Get credentials from environment variables
        base_url = os.getenv("SAGE_CRM_URL")
        username = os.getenv("SAGE_CRM_USERNAME")
        password = os.getenv("SAGE_CRM_PASSWORD")
        
        if not all([base_url, username, password]):
            print("Error: Please set SAGE_CRM_URL, SAGE_CRM_USERNAME, and SAGE_CRM_PASSWORD environment variables")
            return
            
        # Initialize the client
        client = SageCRMClient(
            base_url=base_url,
            username=username,
            password=password
        )
        
        # Example: Get all open tickets
        print("Fetching open tickets...")
        open_tickets = client.get_tickets(status="open")
        print(f"Found {len(open_tickets)} open tickets")
        
        # Example: Create a new ticket
        print("\nCreating a new ticket...")
        new_ticket = client.create_ticket({
            "subject": "API Test Ticket",
            "description": "This ticket was created via API",
            "priority": "medium",
            "status": "open"
        })
        print(f"Created ticket: {new_ticket.get('id')} - {new_ticket.get('subject')}")
        
        # Example: Update the ticket
        if new_ticket and 'id' in new_ticket:
            print(f"\nUpdating ticket {new_ticket['id']}...")
            updated = client.update_ticket(new_ticket['id'], {
                "status": "in_progress",
                "assigned_to": "support@example.com"
            })
            print(f"Updated ticket status to: {updated.get('status')}")
            
            # Example: Get the updated ticket
            print(f"\nFetching updated ticket details...")
            ticket = client.get_ticket(new_ticket['id'])
            print(f"Ticket details: {ticket}")
            
            # Example: Delete the ticket (uncomment to enable)
            # print(f"\nDeleting ticket {new_ticket['id']}...")
            # client.delete_ticket(new_ticket['id'])
            # print("Ticket deleted successfully")
            
    except AuthenticationError as e:
        print(f"Authentication failed: {e}")
    except ResourceNotFoundError as e:
        print(f"Resource not found: {e}")
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


if __name__ == "__main__":
    main()
