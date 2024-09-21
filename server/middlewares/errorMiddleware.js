// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
    // Set default status code to 500 (Internal Server Error) if not already set
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Send response with the error message
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Something went wrong', // Default message if no custom message
        // Optional additional fields
        error: {
            code: statusCode,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        },
    });

    // Log the error details for debugging (only in development mode)
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack); // This will show the error stack trace
    }
};

// middleware/notFound.js

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Passes the error to the error handler
};

module.exports = {
    errorHandler,
    notFound
};
