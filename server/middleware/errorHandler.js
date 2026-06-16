const errorHandler = (err, req, res, next) => {

    console.error(err.stack);

    // Multer file upload errors
    if (err.name === "MulterError") {
        return res.status(400).json({
            message: "File upload error",
            error: err.message
        });
    }

    // Invalid file type
    if (err.message === "Only image files are allowed") {
        return res.status(400).json({
            message: err.message
        });
    }

    // Default error
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    });

};

module.exports = errorHandler;