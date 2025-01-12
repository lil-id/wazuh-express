const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const crypto = require('crypto');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-secure-secret-key';

// Middleware
app.use(helmet());
app.use(bodyParser.json());
app.set('trust proxy', true);

// Verify Wazuh webhook signature
const verifyWazuhSignature = (req, res, next) => {
    const signature = req.headers['x-wazuh-signature'];
    if (!signature) {
        return res.status(401).json({ error: 'No signature provided' });
    }
    // Uncomment to log the signature was received from wazuh
    // console.log('Signature:', signature);
    const payload = JSON.stringify(req.body);
    const expectedSignature = WEBHOOK_SECRET;

    if (signature !== expectedSignature) {
        return res.status(401).json({ error: 'Invalid signature' });
    }

    next();
};

// Webhook endpoint
app.post('/wazuh/alerts', (req, res) => {
    try {
        const alert = req.body;
        console.log('Received Wazuh alert:');
        console.log('Rule ID:', alert.rule?.id);
        console.log('Level:', alert.rule?.level);
        console.log('Description:', alert.rule?.description);
        console.log('Agent:', alert.agent?.name);
        console.log('Full Log:', alert.full_log);
        console.log('Full data:', alert.data);
        console.log('Location:', alert.location);
        
        // Add your custom alert handling logic here
        // For example: storing in database, sending notifications, etc.
        
        res.status(200).json({ status: 'Alert received successfully' });
    } catch (error) {
        console.error('Error processing alert:', error);
        res.status(500).json({ error: 'Error processing alert' });
    }
});

// Root endpoint for testing
app.get('/', (req, res) => {
    res.send('Wazuh webhook receiver is running!');
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Wazuh webhook receiver listening on port ${PORT}`);
});