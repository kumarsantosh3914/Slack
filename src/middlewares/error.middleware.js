export const appErrorHandler = (err, req, res, next) => {
    console.log("Error: ", err);

    const statusCode = err.statusCode || 500;
    
    res.status(statusCode).json({
        success: false,
        message: err.message || 'An unexpected error occurred',
        error: err.name
    });
}

export const genericErrorHandler = (err, req, res, next) => {
    console.log("Error: ", err);

    const statusCode = err.statusCode || 500;
    
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: err.name
    });
}


