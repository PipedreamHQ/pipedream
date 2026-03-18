#!/usr/bin/env bash
set -eu
function main() {
	eval $(command gp env -e);
	readonly api_key_name='PD_API_KEY';

	function write_api_key() {
		local key="$1";
		local config_dir="$HOME/.config/pipedream";
		mkdir -p "$config_dir";
		printf 'api_key = %s\n' "$key" >> "$config_dir/config"
	}
	function log() {
		local kind="$1" && shift;
		printf '[%s]: %s\n' "$kind" "$@";
	}

	if test -v "$api_key_name"; then {
		local -n api_key="$api_key_name";
		if test -n "$api_key"; then {
			write_api_key "$api_key";
			exit 0;
		} else {
			log error "$api_key_name is empty, go fix it at https://gitpod.io/variables";
		} fi
	} else {
		printf "\033[3J\033c\033[3J" # Clears the terminal
		log info "Get your Pipedream API key from:" \
							link "https://pipedream.com/settings/account > Programmatic Access" && printf '\n\n';

		local api_key && read -rs -N 32 -p ">> Paste your pipedream API key: " api_key && printf '\n';
		log info "Adding your API_KEY to https://gitpod.io/variables" && {
			gp env "${api_key_name}=${api_key}" 1>/dev/null;
		}
		log info "Writing API_KEY to current workspace($GITPOD_WORKSPACE_ID) filesystem";
		write_api_key "$api_key";
		printf '\n\n>> %s' "API key setup complete! Press any key to continue ..." && read;
		exit 0;
	} fi
} && main # Doesn't take any argument
# To test for development: gp env -u PD_API_KEY; bash setup.sh
