import HTTPStatus from 'http-status';
import download from 'image-downloader';
import mime from 'mime';
import sharp from 'sharp';

import logger from '../config/winston';
import constants from '../config/constants';
import * as resize from '../modules/resize';

export const renderImage = async (req, res, next) => {
	const width = req.query.w || 0;
	const height = req.query.h || 0;
	const dir_name = req.params.dir;
	const image_name = req.params.image;
	const image_mime = req.query.mime;

	const pathname = dir_name === 'artwork' ? 'lib/artwork' : dir_name;

	const options = {
		url: `${constants.CDN_URL}/${pathname}/${image_name}`,
		dest: `${constants.TMP_PATH}`,
	};

	try {
		const { filename, image } = await download.image(options);
		const mime_type = mime.getType(filename);

		logger.info(filename);
		logger.info(mime_type);

		const _options = {
			width: parseInt(width, 10),
			height: parseInt(height, 10),
			fit: sharp.fit.cover,
			position: 'left top',
			withoutEnlargement: true,
		};

		let data;

		if (image_mime === 'jpeg' || image_mime === 'jpg') {
			data = await resize.jpeg(image, _options);
		} else if (image_mime === 'png') {
			data = await resize.png(image, _options);
		} else {
			data = await resize.webp(image, _options);
		}

		res.setHeader('Content-Type', `image/${image_mime}`);
		return res.status(HTTPStatus.OK).send(data);
	} catch (e) {
		e.status = HTTPStatus.BAD_REQUEST;
		return next(e);
	}
};
