const dotenv = require('dotenv');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const { apiKeyMiddleware } = require('./wazuhMiddleware');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(bodyParser.json());
app.set('trust proxy', true);

// Webhook endpoint
app.post('/wazuh/alerts', apiKeyMiddleware, (req, res) => {
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