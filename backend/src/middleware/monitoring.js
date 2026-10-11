import axios from 'axios';

/**
 * Monitoring middleware for API performance tracking
 * Reusable across different client applications
 */
const monitoringMiddleware = (options = {}) => {
    const apiKey = options.apiKey || process.env.MONITORING_API_KEY || 'apim_cff3ff1a650076b8546a0b10572ab0d4dca574de';
    let endpoint = options.endpoint || process.env.MONITORING_ENDPOINT || 'https://api-monitoring-api-8p7a.onrender.com/api/hit';
    const serviceName = options.serviceName || process.env.SERVICE_NAME || 'ShopSphere';
    const enableLogging = process.env.MONITORING_ENABLE_LOGGING === 'true'
        ? true
        : (options.enableLogging !== undefined ? options.enableLogging : process.env.NODE_ENV !== 'production');
    const timeout = options.timeout || 5000;
    const enabled = options.enabled !== undefined
        ? options.enabled
        : (process.env.MONITORING_ENABLED !== 'false');

    if (process.env.NODE_ENV === 'production' && endpoint.includes('localhost')) {
        console.warn(`[Monitoring] Warning: MONITORING_ENDPOINT was set to localhost in production ("${endpoint}"). Automatically falling back to live monitoring endpoint: https://api-monitoring-api-8p7a.onrender.com/api/hit`);
        endpoint = 'https://api-monitoring-api-8p7a.onrender.com/api/hit';
    }

    // If monitoring is disabled, return pass-through middleware
    if (!enabled) {
        if (enableLogging) {
            console.log('[Monitoring] Disabled via configuration');
        }
        return (req, res, next) => next();
    }

    if (!apiKey) {
        console.warn('[Monitoring] Warning: MONITORING_API_KEY is not set. Monitoring telemetry will not send data.');
        return (req, res, next) => next();
    }

    return (req, res, next) => {
        // Skip static asset requests and health checks from polluting metrics
        const url = req.originalUrl || req.url || '';
        if (url.startsWith('/uploads') || url.includes('favicon.ico')) {
            return next();
        }

        const startTime = Date.now();

        // Listen for the response finish event to ensure status code and headers are complete
        res.on('finish', () => {
            const responseTime = Date.now() - startTime;

            // Resolve real client IP behind reverse proxies (Render / Cloudflare / Vercel)
            const forwarded = req.headers?.['x-forwarded-for'];
            const clientIp = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : null)
                || req.ip
                || req.socket?.remoteAddress
                || 'unknown';

            // Prepare monitoring data
            const monitoringData = {
                serviceName: serviceName,
                endpoint: url || '/',
                method: req.method,
                statusCode: res.statusCode || 200,
                latencyMs: Math.max(1, responseTime),
                ip: clientIp,
                userAgent: req.get('User-Agent') || 'unknown'
            };

            // Send monitoring data asynchronously (does not block client response)
            setImmediate(() => {
                sendMonitoringData(monitoringData, { apiKey, endpoint, enableLogging, timeout });
            });
        });

        next();
    };
};

async function sendMonitoringData(data, options) {
    try {
        if (options.enableLogging) {
            console.log('[Monitoring] Sending telemetry hit:', {
                endpoint: data.endpoint,
                method: data.method,
                statusCode: data.statusCode,
                latencyMs: data.latencyMs,
                target: options.endpoint
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
            console.log('[Monitoring] Telemetry hit sent successfully');
        }
    } catch (error) {
        // Fail gracefully to not disrupt the main application, but log warning so issues can be diagnosed
        if (options.enableLogging || process.env.NODE_ENV === 'production') {
            if (error.response) {
                console.error('[Monitoring] Ingest error response:', error.response.status, error.response.data?.message || error.response.statusText);
            } else {
                console.error('[Monitoring] Ingest connection error:', error.message, `(Target: ${options.endpoint})`);
            }
        }
    }
}

export default monitoringMiddleware;