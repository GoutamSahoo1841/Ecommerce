import axios from 'axios';
/**
 * Monitoring middleware for API performance tracking
 * Reusable across different client applications
 */
const monitoringMiddleware = (options = {}) => {
    const apiKey = options.apiKey || process.env.MONITORING_API_KEY;
    const endpoint = options.endpoint || process.env.MONITORING_ENDPOINT || 'http://localhost:5000/api/hit';
    const serviceName = options.serviceName || process.env.SERVICE_NAME || 'my-service';
    const enableLogging = options.enableLogging !== undefined
        ? options.enableLogging
        : (process.env.MONITORING_ENABLE_LOGGING === 'true' || process.env.NODE_ENV !== 'production');
    const timeout = options.timeout || 3000;
    const enabled = options.enabled !== undefined
        ? options.enabled
        : (process.env.MONITORING_ENABLED !== 'false');

    // If monitoring is disabled or no API key, return pass-through middleware
    if (!enabled) {
        if (enableLogging) {
            console.log('[Monitoring] Disabled via configuration');
        }
        return (req, res, next) => next();
    }

    if (!apiKey) {
        console.warn('[Monitoring] Warning: MONITORING_API_KEY is not set in environment variables. Monitoring will not send data.');
        return (req, res, next) => next();
    }

    if (process.env.NODE_ENV === 'production' && endpoint.includes('localhost')) {
        console.warn(`[Monitoring] Warning: MONITORING_ENDPOINT is pointing to "${endpoint}" in production. A deployed cloud server cannot reach localhost! Set a public URL in your deployment environment variables.`);
    }

    return (req, res, next) => {
        const startTime = Date.now();

        // Capture the original response end function
        const originalEnd = res.end;

        res.end = function (...args) {
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            // Prepare monitoring data
            const monitoringData = {
                serviceName: serviceName,
                endpoint: req.originalUrl || req.url,
                method: req.method,
                statusCode: res.statusCode,
                latencyMs: responseTime,
                ip: req.ip || req.connection?.remoteAddress || 'unknown',
                userAgent: req.get('User-Agent') || 'unknown'
            };

            // Send monitoring data asynchronously (don't block response)
            setImmediate(() => {
                sendMonitoringData(monitoringData, { apiKey, endpoint, enableLogging, timeout });
            });

            // Call original end function
            originalEnd.apply(res, args);
        };

        next();
    };
};

async function sendMonitoringData(data, options) {
    try {
        if (options.enableLogging) {
            console.log('Sending monitoring data:', {
                endpoint: data.endpoint,
                method: data.method,
                statusCode: data.statusCode,
                latencyMs: data.latencyMs
            });
        }

        await axios.post(options.endpoint, data, {
            headers: {
                'x-api-key': options.apiKey,
                'Content-Type': 'application/json'
            },
            timeout: options.timeout
        });

        if (options.enableLogging) {
            console.log('Monitoring data sent successfully');
        }
    } catch (error) {
        // Fail silently to not disrupt the main application
        if (options.enableLogging) {
            if (error.response) {
                console.error('Failed to send monitoring data:', error.response.status, error.response.data?.message || error.response.statusText);
            } else {
                console.error('Failed to send monitoring data:', error.message);
            }
        }
    }
}

export default monitoringMiddleware;