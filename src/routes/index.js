import { Router } from 'express';
import HTTPStatus from 'http-status';

import APIError from '../services/error';
import * as ic from '../controllers/image.controller';

const routes = new Router();

routes.get('/images/:dir/:image', ic.renderImage);

routes.all('*', (req, res, next) =>
	next(new APIError('Not Found!', HTTPStatus.NOT_FOUND, true))
);

export default routes;
