from config.config import config
from supabase import create_client
from dotenv import load_dotenv
load_dotenv()


class SupabaseConnector:
    def __init__(self):
        self.client = create_client(
            config['supabase']['url'],
            config['supabase']['api_key']
        )
        self.table = 'components'
