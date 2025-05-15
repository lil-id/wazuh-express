#!/bin/bash

WEBHOOK_URL="$3"
WEBHOOK_SECRET="$2"
ALERT_FILE="$1"

if [ ! -r "${ALERT_FILE}" ]; then
    echo "Cannot read ${ALERT_FILE}" >> /var/ossec/logs/integrations.log
    exit 1
fi

ALERT_JSON=$(cat "${ALERT_FILE}")
SIGNATURE=$(echo -n "${ALERT_JSON}" | openssl dgst -sha256 -hmac "${WEBHOOK_SECRET}" -hex | cut -d' ' -f2)

# Log the attempt
echo "Sending alert to ${WEBHOOK_URL}" >> /var/ossec/logs/integrations.log

RESPONSE=$(curl -s -X POST "${WEBHOOK_URL}" \
    -H "Content-Type: application/json" \
    -H "X-Wazuh-Signature: ${SIGNATURE}" \
    --data "${ALERT_JSON}")

# Log the response
echo "Response: ${RESPONSE}" >> /var/ossec/logs/integrations.log