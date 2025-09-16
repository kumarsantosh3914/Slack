import logger from "../config/logger.config.js";

export const pingHandler = async (req, res, next) => {
    logger.info("ping request received");
    res.status(200).json({ message: "pong" });
};


