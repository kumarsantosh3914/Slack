import { v4 as uuidv4 } from "uuid";
import { asyncLocalStorage } from "../utils/helpers/request.helpers.js";

export const attachCorrelationIdMiddleware = (req, res, next) => {
    const correlationId = uuidv4();
    req.headers['x-correlation-id'] = correlationId;
    asyncLocalStorage.run({ correlationId: correlationId }, () => {
        next();
    })
}


