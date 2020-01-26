require('dotenv').config();

const devConfig = {
	ENV_STATUS: process.env.ENV_STATUS,
};

const testConfig = {
};

const prodConfig = {
	ENV_STATUS: process.env.ENV_STATUS,
};

const defaultConfig = {
	PORT: process.env.PORT || 5000,
	TMP_PATH: `${process.env.PWD}/tmp`,
};

function envConfig(env) {
	switch (env) {
		case 'development':
			return devConfig;
		case 'test':
			return testConfig;
		default:
			return prodConfig;
	}
}

export default {
	...defaultConfig,
	...envConfig(process.env.NODE_ENV),
};
