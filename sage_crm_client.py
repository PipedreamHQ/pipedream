import requests
import base64
from typing import Dict, List, Optional, Union
from urllib.parse import urljoin

class SageCRMClient:
    """
    A client for interacting with Sage CRM's REST API.
    Handles authentication and provides methods for ticket management.
    """
    
    def __init__(self, base_url: str, username: str, password: str):
        """
        Initialize the Sage CRM client.
        
        Args:
            base_url: Base URL of your Sage CRM instance (e.g., 'https://your-company.crm.sage.com')
            username: Your Sage CRM username
            password: Your Sage CRM password
        """
        self.base_url = base_url.rstrip('/')
        self.api_base = f"{self.base_url}/api"
        self.session = requests.Session()
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
    
    def _make_request(self, method: str, endpoint: str, **kwargs) -> Dict:
        """Make an API request and handle the response."""
        url = urljoin(f"{self.api_base}/", endpoint.lstrip('/'))
        try:
            response = self.session.request(method, url, **kwargs)
            response.raise_for_status()
            return response.json() if response.content else {}
        except requests.exceptions.RequestException as e:
            print(f"Error making {method} request to {url}: {e}")
            raise

    # Ticket Operations
    
    def get_tickets(self, query: str = None, **filters) -> List[Dict]:
        """
        Get a list of tickets, optionally filtered by query or other parameters.
        
        Args:
            query: Search query string
            **filters: Additional filter parameters (e.g., status='open')
            
        Returns:
            List of ticket dictionaries
        """
        params = {}
        if query:
            params['query'] = query
        params.update(filters)
        
        return self._make_request('GET', 'tickets', params=params)
    
    def get_ticket(self, ticket_id: Union[str, int]) -> Dict:
        """
        Get a specific ticket by ID.
        
        Args:
            ticket_id: The ID of the ticket to retrieve
            
        Returns:
            Ticket details as a dictionary
        """
        return self._make_request('GET', f'tickets/{ticket_id}')
    
    def create_ticket(self, ticket_data: Dict) -> Dict:
        """
        Create a new ticket.
        
        Args:
            ticket_data: Dictionary containing ticket details
            
        Returns:
            The created ticket details
        """
        return self._make_request('POST', 'tickets', json=ticket_data)
    
    def update_ticket(self, ticket_id: Union[str, int], update_data: Dict) -> Dict:
        """
        Update an existing ticket.
        
        Args:
            ticket_id: The ID of the ticket to update
            update_data: Dictionary containing fields to update
            
        Returns:
            The updated ticket details
        """
        return self._make_request('PUT', f'tickets/{ticket_id}', json=update_data)
    
    def delete_ticket(self, ticket_id: Union[str, int]) -> bool:
        """
        Delete a ticket.
        
        Args:
            ticket_id: The ID of the ticket to delete
            
        Returns:
            True if deletion was successful
        """
        self._make_request('DELETE', f'tickets/{ticket_id}')
        return True

# Example usage
if __name__ == "__main__":
    # Initialize the client with your credentials
    client = SageCRMClient(
        base_url="https://your-company.crm.sage.com",
        username="your_username",
        password="your_password"
    )
    
    # Example: Get all open tickets
    open_tickets = client.get_tickets(status="open")
    print("Open tickets:", open_tickets)
    
    # Example: Create a new ticket
    new_ticket = client.create_ticket({
        "subject": "API Test Ticket",
        "description": "This ticket was created via API",
        "priority": "medium",
        "status": "open"
    })
    print("Created ticket:", new_ticket)
    
    # Example: Update a ticket
    if new_ticket and 'id' in new_ticket:
        updated = client.update_ticket(new_ticket['id'], {
            "status": "in_progress",
            "assigned_to": "support_agent@example.com"
        })
        print("Updated ticket:", updated)
