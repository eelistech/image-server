/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import fs from 'fs';
import path from 'path';

module.exports = async (dir, file) => {
	const filesToReturn = [];
	const walkDir = currentPath => {
		const files = fs.readdirSync(currentPath);
		for (const i in files) {
			const curFile = path.join(currentPath, files[i]);
			if (fs.statSync(curFile).isFile() && file === path.basename(curFile)) {
				filesToReturn.push(curFile.replace(dir, ''));
			} else if (fs.statSync(curFile).isDirectory()) {
				walkDir(curFile);
			}
		}
	};
	
	walkDir(dir);
	return filesToReturn;
};
