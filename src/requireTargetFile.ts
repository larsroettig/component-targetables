// eslint-disable-next-line global-require,import/no-dynamic-require
const requireTargetFile = (path: string): any => require(path);
module.exports.requireTargetFile = requireTargetFile;
