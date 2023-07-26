import os
from supabase import create_client, Client
from dotenv import load_dotenv
load_dotenv()


class SupabaseConnector:
    def __init__(self):
        url: str = os.environ.get('SUPABASE_URL')
        key: str = os.environ.get('SUPABASE_KEY')
        self.table: str = 'components'
        self.client: Client = create_client(url, key)
