SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
BASE_PATH=$SCRIPT_DIR/output/

echo "running github..."
poetry run python main.py --component_type action --app github "how to get a specific repository" > "$BASE_PATH"/github-get-repository.mjs 2>&1
echo "running stripe..."
poetry run python main.py --component_type action --app stripe "how to cancel a payment intent" > "$BASE_PATH"/stripe-cancel-payment-intent.mjs 2>&1
echo "running twilio..."
poetry run python main.py --component_type action --app twilio "how to get a message" > "$BASE_PATH"/twilio-get-message.mjs 2>&1
echo "running woocommerce..."
poetry run python main.py --component_type action --app woocommerce "how to search for customers" > "$BASE_PATH"/woocommerce-search-customers.mjs 2>&1
echo "running postmark..."
poetry run python main.py --component_type action --app postmark "how to send an email" > "$BASE_PATH"/postmark-send-single-email.mjs 2>&1

echo "running process_street..."
poetry run python main.py --component_type action --app process_street "how to start a workflow run" > "$BASE_PATH"/process_street-start-workflow-run.mjs 2>&1
echo "running zenkit..."
poetry run python main.py --component_type action --app zenkit "how to add a comment to an entry/item within a list/collection" > "$BASE_PATH"/zenkit-add-entry-comment.mjs 2>&1
echo "running fibery..."
poetry run python main.py --component_type action --app fibery "how to get an entity or create one if it doesn't exist" > "$BASE_PATH"/fibery-get-entity-or-create.mjs 2>&1
echo "running tally..."
poetry run python main.py --component_type action --app tally "how to get a list of responses" > "$BASE_PATH"/tally-get-responses.mjs 2>&1

echo "running asana..."
poetry run python main.py --component_type action --app asana "how to update a task" > "$BASE_PATH"/asana-update-task.mjs 2>&1
echo "running accelo..."
poetry run python main.py --component_type action --app accelo "how to create a contact" > "$BASE_PATH"/accelo-create-contact.mjs 2>&1
echo "running shipcloud..."
poetry run python main.py --component_type action --app shipcloud "how to get information about a shipment" > "$BASE_PATH"/shipcloud-get-shipment-info.mjs 2>&1
echo "running quaderno..."
poetry run python main.py --component_type action --app quaderno "how to create an invoice" > "$BASE_PATH"/quaderno-create-invoice.mjs 2>&1
echo "running brex..."
poetry run python main.py --component_type action --app brex "how to set a limit for an user" > "$BASE_PATH"/brex-set-limit-for-user.mjs 2>&1
