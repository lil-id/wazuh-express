#!/bin/bash

ALERT_FILE="$1"
WEBHOOK_SECRET="$2"
WEBHOOK_URL="$3"

if [ ! -r ${ALERT_FILE} ]; then
    echo "Cannot read ${ALERT_FILE}" >> /var/ossec/logs/integrations.log
    exit 1
fi

ALERT_JSON=$(cat "${ALERT_FILE}")
SIGNATURE=$(echo -n "${ALERT_JSON}" | openssl dgst -sha256 -hmac "${WEBHOOK_SECRET}" -hex | cu>

# Log the attempt
echo "Sending alert to ${WEBHOOK_URL}" >> /var/ossec/logs/integrations.log

# Use curl to send the alert
RESPONSE=$(curl -s -X POST "${WEBHOOK_URL}" \
    -H "Content-Type: application/json" \
    -H "X-API-Key: ${WEBHOOK_SECRET}" \
    --data "${ALERT_JSON}")

# Log the response
echo "Response: ${RESPONSE}" >> /var/ossec/logs/integrations.log