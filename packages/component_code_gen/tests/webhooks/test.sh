SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
BASE_PATH=$SCRIPT_DIR/output/

echo "running github..."
poetry run python generate_webhook_source.py --app github "how to get webhooks for every new commit" > "$BASE_PATH"/github-new-commit.mjs
echo "running stripe..."
poetry run python generate_webhook_source.py --app stripe "how to get webhooks for every new payment" > "$BASE_PATH"/stripe-new-payment.mjs
echo "running twilio..."
poetry run python generate_webhook_source.py --app twilio "how to get webhooks for every new call" > "$BASE_PATH"/twilio-new-call.mjs
echo "running woocommerce..."
poetry run python generate_webhook_source.py --app woocommerce "how to get webhooks for every new order event" > "$BASE_PATH"/woocommerce-new-order-event.mjs
echo "running postmark..."
poetry run python generate_webhook_source.py --app postmark "how to get webhooks for every new inbound email" > "$BASE_PATH"/postmark-new-inbound-email-received.mjs

echo "running process_street..."
poetry run python generate_webhook_source.py --app process_street "how to get webhooks for every new completed workflow run" > "$BASE_PATH"/process_street-workflow-run-completed.mjs
echo "running zenkit..."
poetry run python generate_webhook_source.py --app zenkit "how to get webhooks for every new notification" > "$BASE_PATH"/zenkit-new-notification.mjs
echo "running fibery..."
poetry run python generate_webhook_source.py --app fibery "how to get webhooks for every new created entity" > "$BASE_PATH"/fibery-entity-created.mjs
echo "running tally..."
poetry run python generate_webhook_source.py --app tally "how to get webhooks for every new response" > "$BASE_PATH"/tally-new-response.mjs

echo "running asana..."
poetry run python generate_webhook_source.py --app asana "how to get webhooks for every new project" > "$BASE_PATH"/asana-new-project.mjs
echo "running accelo..."
poetry run python generate_webhook_source.py --app accelo "how to get webhooks for every new assigned task" > "$BASE_PATH"/accelo-new-task-assigned.mjs
echo "running shipcloud..."
poetry run python generate_webhook_source.py --app shipcloud "how to get webhooks for every new shipment status" > "$BASE_PATH"/shipcloud-new-shipment-status.mjs
echo "running quaderno..."
poetry run python generate_webhook_source.py --app quaderno "how to get webhooks for every new received payment" > "$BASE_PATH"/quaderno-payment-received.mjs
