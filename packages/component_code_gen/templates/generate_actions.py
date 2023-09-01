from templates.actions.additional_rules import additional_rules
from templates.actions.export_summary import export_summary
from templates.actions.introduction import introduction
from templates.actions.main_example import main_example
from templates.actions.other_example import other_example
from templates.common.app_prop import app_prop
from templates.common.auth import auth
from templates.common.component_metadata import action_metadata
from templates.common.platform_axios import platform_axios
from templates.common.props import props
from templates.common.rules import rules
from templates.common.async_options import async_options
from templates.common.typescript_definitions import typescript_definitions
from templates.common.end import end

def system_instructions(auth_example=""):
    return f"""{introduction}

{main_example}

{app_prop}

{auth}

{auth_example}

{props}

{export_summary}

{platform_axios}

{other_example}

{async_options}

{action_metadata}

{typescript_definitions}

{rules}

{additional_rules}

{end}"""
