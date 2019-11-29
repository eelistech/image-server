import sharp from 'sharp';

export const jpeg = async (image, options) => {
	const operation = await sharp(image)
		.withMetadata()
		.resize(options)
		.jpeg({ quality: 100, chromaSubsampling: '4:4:4' })
		.toBuffer({ resolveWithObject: true });

	return operation.data;
};

export const png = async (image, options) => {
	const operation = await sharp(image)
		.withMetadata()
		.resize(options)
		.png()
		.toBuffer({ resolveWithObject: true });

	return operation.data;
};

export const webp = async (image, options) => {
	const operation = await sharp(image)
		.withMetadata()
		.resize(options)
		.webp({ lossless: true })
		.toBuffer({ resolveWithObject: true });

	return operation.data;
};
