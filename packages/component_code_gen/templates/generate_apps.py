from templates.apps.additional_rules import additional_rules
from templates.apps.auth import auth
from templates.apps.introduction import introduction
from templates.apps.main_example import main_example
from templates.apps.methods import methods
from templates.apps.prop_definitions import prop_definitions
from templates.common.common_files import common_files
from templates.common.platform_axios import platform_axios
from templates.common.rules import rules
from templates.common.async_options import async_options
from templates.common.typescript_definitions import typescript_definitions
from templates.common.end import end

def system_instructions(auth_example="", parsed_common_files=""):
    return f"""{introduction}

{main_example}

{auth}

{auth_example}

{prop_definitions}

{methods}

{platform_axios}

{async_options}

{common_files(parsed_common_files)}

{typescript_definitions}

{rules}

{additional_rules}

{end}"""
