/* eslint-disable import/extensions, import/no-unresolved */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import fs from 'fs';
import path from 'path';
import globby from 'globby';

const { requireTargetFile } = require('./requireTargetFile');

class ExtendLocalIntercept {
  private targetables: any;

  private componentsCache: Record<string, any> = {};

  constructor(targetables: any) {
    this.targetables = targetables;
  }

  /**
   * @param string[] targetablesSearchPaths - array of paths to search for targetables
   * @param string fileExtension
   * @param string magentoPath
   */
  public allowCustomTargetables = (
    targetablesSearchPaths = ['src/components', 'src/RootComponents'],
    fileExtension = '*.targetables.js',
    magentoPath = 'node_modules/@magento',
  ) => {
    (async () => {
      const currentPath = process.cwd();
      const paths = await this.getPathsByFileExtension(
        fileExtension,
        targetablesSearchPaths,
      );

      const replaceRegex = this.buildRegex(targetablesSearchPaths);

      const pathReplacement = fileExtension.substring(
        1,
        fileExtension.length - 3,
      );

      paths.forEach((myPath: string) => {
        const relativePath = myPath
          .replace(pathReplacement, '')
          .replace(
            replaceRegex,
            `${magentoPath}/venia-ui/lib/$<type>`,
          );
        const absolutePath = path.resolve(currentPath, relativePath);

        fs.stat(
          absolutePath,
          (err: any, stat: { isFile: () => any }) => {
            if (!err && stat && stat.isFile()) {
              const component = this.getReactComponent(
                relativePath.replace('node_modules/', ''),
              );

              const componentInterceptor = requireTargetFile(
                `${currentPath}/${myPath}`,
              );
              componentInterceptor.interceptComponent(component);
            } else {
              console.warn('Error in allowCustomTargetables', err);
            }
          },
        );
      });
    })();
  };

  /**
   * @param string[] targetablesSearchPaths - array of paths to search for targetables
   * @param string fileExtension
   * @param string magentoPath
   */
  public allowCssOverwrites = (
    targetablesSearchPaths = ['src/components', 'src/RootComponents'],
    fileExtension = '*.css',
    magentoPath = 'node_modules/@magento',
  ) => {
    (async () => {
      const currentPath = process.cwd();
      const paths = await this.getPathsByFileExtension(
        fileExtension,
        targetablesSearchPaths,
      );

      const replaceRegex = this.buildRegex(targetablesSearchPaths);

      paths.forEach((myPath: string) => {
        const relativePath = myPath.replace(
          replaceRegex,
          `${magentoPath}/venia-ui/lib/$<type>`,
        );
        const absolutePath = path.resolve(currentPath, relativePath);

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
            } else {
              console.warn('Error in allowCssOverwrites', err);
            }
          },
        );
      });
    })();
  };

  private buildRegex = (targetablesSearchPaths: string[]): RegExp => {
    const componentPaths: string[] = [];
    const rootPaths: string[] = [];

    targetablesSearchPaths.forEach((tmpPath: string) => {
      const [rootPath, componentPath] = tmpPath.split('/', 2);
      componentPaths.push(componentPath);
      rootPaths.push(rootPath);
    });

    return new RegExp(
      `(${rootPaths.join('|')})/(?<type>${componentPaths.join('|')})`,
      '',
    );
  };

  private getReactComponent = (modulePath: string) => {
    if (this.componentsCache[modulePath] !== undefined) {
      return this.componentsCache[modulePath];
    }

    this.componentsCache[modulePath] =
      this.targetables.reactComponent(modulePath);

    return this.componentsCache[modulePath];
  };

  private getPathsByFileExtension(
    fileExtension: string,
    targetablesSearchPaths: string[] = [
      'components',
      'RootComponents',
    ],
  ) {
    const paths: string[] = [];

    const tmp = globby.sync(targetablesSearchPaths, {
      expandDirectories: {
        files: [fileExtension],
      },
    });

    if (tmp.length > 0) {
      paths.push(...tmp);
    } else {
      console.warn(
        'No targetables found in',
        targetablesSearchPaths,
        fileExtension,
      );
    }

    return paths;
  }
}
// eslint-disable-next-line import/prefer-default-export
export { ExtendLocalIntercept };
module.exports.ExtendLocalIntercept = ExtendLocalIntercept;
