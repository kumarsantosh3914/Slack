export const appErrorHandler = (err, req, res, next) => {
    console.log("Error: ", err);

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}

export const genericErrorHandler = (err, req, res, next) => {
    console.log("Error: ", err);

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}


