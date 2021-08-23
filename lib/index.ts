const globby = require('globby');
const path = require('path');
const fs = require('fs');
const { Targetables } = require('@magento/pwa-buildpack');

const componentTargetablesDefinitions = (
  targets: any,
  fileExtendsion = '*.targetables.js',
  magentoPath = 'node_modules/@magento',
) => {
  const targetables = Targetables.using(targets);

  (async () => {
    const paths = await globby('src/components', {
      expandDirectories: {
        files: [fileExtendsion],
      },
    });

    paths.forEach((myPath: string) => {
      const relativePath = myPath
        .replace('.targetables', '')
        .replace('src/components', `${magentoPath}/venia-ui/lib/components`);
      const absolutePath = path.resolve(relativePath);

      fs.stat(absolutePath, (err: any, stat: { isFile: () => any }) => {
        if (!err && stat && stat.isFile()) {
          const component = targetables.reactComponent(
            relativePath.replace('node_modules/', ''),
          );
          // eslint-disable-next-line global-require,import/no-dynamic-require
          const componentInterceptor = require(`./${myPath}`);
          componentInterceptor.interceptComponent(component);
        }
      });
    });
  })();
};

exports.componentTargetablesDefinitions = componentTargetablesDefinitions;
