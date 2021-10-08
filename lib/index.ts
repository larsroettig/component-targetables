const fs = require('fs');
const path = require('path');
const globby = require('globby');

class ExtendLocalIntercept {
  private targetables: any;

  private componentsCache: Record<string, any> = {};

  constructor(targetables: any) {
    this.targetables = targetables;
  }

  /**
   * @param string fileExtendsion
   * @param string magentoPath
   */
  public allowCustomTargetables = (
    fileExtendsion = '*.targetables.js',
    magentoPath = 'node_modules/@magento',
  ) => {
    (async () => {
      const currentPath = process.cwd();
      const paths = await this.getPathsByFileExtendsion(
        fileExtendsion,
      );

      paths.forEach((myPath: string) => {
        const relativePath = myPath
          .replace('.targetables', '')
          .replace(
            /src\/(?<type>components|RootComponents)/,
            `${magentoPath}/venia-ui/lib/$<type>`,
          );
        const absolutePath = path.resolve(relativePath);

        fs.stat(
          absolutePath,
          (err: any, stat: { isFile: () => any }) => {
            if (!err && stat && stat.isFile()) {
              const component = this.getReactComponent(
                relativePath.replace('node_modules/', ''),
              );
              // eslint-disable-next-line global-require,import/no-dynamic-require
              const componentInterceptor = require(`${currentPath}/${myPath}`);
              componentInterceptor.interceptComponent(component);
            }
          },
        );
      });
    })();
  };

  /**
   * @param string fileExtendsion
   * @param string magentoPath
   */
  public allowCssOverwrites = (
    fileExtendsion = '*.css',
    magentoPath = 'node_modules/@magento',
  ) => {
    (async () => {
      const paths = await this.getPathsByFileExtendsion(
        fileExtendsion,
      );

      paths.forEach((myPath: string) => {
        const relativePath = myPath.replace(
          /src\/(?<type>components|RootComponents)/,
          `${magentoPath}/venia-ui/lib/$<type>`,
        );
        const absolutePath = path.resolve(relativePath);

        fs.stat(
          absolutePath,
          (err: any, stat: { isFile: () => any }) => {
            if (!err && stat && stat.isFile()) {
              /**
               * This means we have matched a local file to something in venia-ui!
               * Find the JS  component from our CSS file name
               * */
              const jsComponent = relativePath
                .replace('node_modules/', '')
                .replace('.css', '.js');

              const eSModule = this.getReactComponent(jsComponent);
              /** Add import for our custom CSS classes */
              eSModule.addImport(
                `import localClasses from "${myPath}"`,
              );

              /** Update the mergeClasses() method to inject our additional custom css */
              eSModule.insertAfterSource(
                'const classes = useStyle(defaultClasses, ',
                'localClasses, ',
              );
            }
          },
        );
      });
    })();
  };

  private getReactComponent = (modulePath: string) => {
    if (this.componentsCache[modulePath] !== undefined) {
      return this.componentsCache[modulePath];
    }

    this.componentsCache[modulePath] =
      this.targetables.reactComponent(modulePath);

    return this.componentsCache[modulePath];
  };

  private getPathsByFileExtendsion(fileExtendsion: string) {
    const targetablesSearchPaths = [
      'src/components',
      'src/RootComponents',
    ];

    const paths: string[] = [];
    targetablesSearchPaths.forEach(async (targetablesSearchPath) => {
      const tmp = await globby(targetablesSearchPath, {
        expandDirectories: {
          files: [fileExtendsion],
        },
      });
      paths.push(...tmp);
    });

    return paths;
  }
}
// eslint-disable-next-line import/prefer-default-export
export { ExtendLocalIntercept };
module.exports.ExtendLocalIntercept = ExtendLocalIntercept;
