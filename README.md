## Integrating Wazuh with Express

Create new integration file `nano /var/ossec/integrations/custom-chatbot-webhook`

Let's add below code to the file

```
#!/bin/bash

ALERT_FILE="$1"
WEBHOOK_SECRET="$2"
WEBHOOK_URL="$3"

if [ ! -r ${ALERT_FILE} ]; then
    echo "Cannot read ${ALERT_FILE}" >> /var/ossec/logs/integrations.log
    exit 1
fi

ALERT_JSON=$(cat "${ALERT_FILE}")
SIGNATURE=$(echo -n "${ALERT_JSON}" | openssl dgst -sha256 -hmac "${WEBHOOK_SECRET}" -hex | cut -d' ' -f2)

# Log the attempt
echo "Sending alert to ${WEBHOOK_URL}" >> /var/ossec/logs/integrations.log

# Use curl to send the alert
RESPONSE=$(curl -s -X POST "${WEBHOOK_URL}" \
    -H "Content-Type: application/json" \
    -H "X-Wazuh-Signature: ${SIGNATURE}" \
    --data "${ALERT_JSON}")

# Log the response
echo "Response: ${RESPONSE}" >> /var/ossec/logs/integrations.log
```

Save it, `Ctrl + X` and Y then press `Enter`

Open the ossec file `nano /var/ossec/etc/ossec.conf`

Add below integration script
```
<integration>
    <name>custom-chatbot-webhook</name>
    <hook_url>https://39b4-114-125-222-178.ngrok-free.app/wazuh/alerts</hook_url>
    <api_key>xxxx</api_key>  # Same as WEBHOOK_SECRET
    <level>3</level>  # Minimum alert level to forward
    <alert_format>json</alert_format>
</integration>
```

Your custom integration name must start with "**custom-**" like above.

Then restart the wazuh manager `systemctl restart wazuh-manager`.

Make sure your webhook secret is same as wazuh signature.