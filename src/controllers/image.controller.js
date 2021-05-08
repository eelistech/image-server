import HTTPStatus from 'http-status';
import download from 'image-downloader';
import mime from 'mime';
import sharp from 'sharp';

import logger from '../config/winston';
import constants from '../config/constants';
import * as resize from '../modules/resize';

export const renderImage = async (req, res, next) => {
	const secure = await req.query.secure;

	const image_path = req.params[0];
	const split_path = image_path.split('/');
	// [ 'width', '163.5', 'height', '163.5', 'mime', 'webp', 'localhost:3000', 'images', 'o_a_1.jpg' ]
	const width = split_path[0] === 'width' ? split_path[1] : 0;
	const height = split_path[2] === 'height' ? split_path[3] : width;
	const image_mime = split_path[2] === 'mime' ? split_path[3] : (split_path[4] === 'mime' ? split_path[5] : 'webp');

	const l = split_path.length;
	const dirs = split_path[l - 2];
	const dir_path = dirs.split('-').join('/');
	const image_url = `http${secure && secure === '1' ? 's' : ''}://${split_path[l - 3]}/${dir_path}/${split_path[l - 1]}`;
	logger.info(image_url);

	const options = {
		url: image_url,
		dest: `${constants.TMP_PATH}`,
	};

	try {
		logger.info(options);
		const { filename } = await download.image(options);
		const mime_type = mime.getType(filename);

		// logger.info(filename);
		logger.info(mime_type);
		logger.info(image_mime);

		const _options = {
			width: parseInt(width, 10),
			height: parseInt(height, 10),
			fit: sharp.fit.contain,
			withoutEnlargement: true,
			background: { r: 255, g: 255, b: 255, alpha: 1.0 },
		};

		let data;

		if (image_mime === 'jpeg' || image_mime === 'jpg') {
			data = await resize.jpeg(filename, _options);
		} else if (image_mime === 'png') {
			data = await resize.png(filename, _options);
		} else {
			data = await resize.webp(filename, _options);
		}

		res.setHeader('Content-Type', `image/${image_mime}`);
		return res.status(HTTPStatus.OK).send(data);
	} catch (e) {
		e.status = HTTPStatus.BAD_REQUEST;
		return next(e);
	}
};
