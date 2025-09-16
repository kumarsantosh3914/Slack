import express from 'express';
import { pingHandler } from '../../controllers/ping.controller.js';
import { pingSchema } from '../../validators/ping.validators.js';
import { validateRequestBody } from '../../validators/index.js';

const pingRouter = express.Router();

pingRouter.get('/', validateRequestBody(pingSchema), pingHandler);

pingRouter.get('/helth', (req, res) => {
    res.status(200).json('OK');
});

export default pingRouter;


