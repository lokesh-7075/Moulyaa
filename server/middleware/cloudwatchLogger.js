/**
 * Amazon CloudWatch Structured Logging Middleware
 * Outputs structured JSON logs suitable for CloudWatch Log Insights queries
 */
const cloudwatchLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      durationMs: duration,
      ip: req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"],
      awsRegion: process.env.AWS_REGION || "us-east-1",
      environment: process.env.NODE_ENV || "development"
    };

    if (res.statusCode >= 400) {
      console.error("[AWS CloudWatch ERROR]", JSON.stringify(logData));
    } else {
      console.log("[AWS CloudWatch INFO]", JSON.stringify(logData));
    }
  });

  next();
};

module.exports = cloudwatchLogger;
