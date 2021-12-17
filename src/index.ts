/* eslint-disable import/extensions, import/no-unresolved */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import { promises as fs } from 'fs';
import path from 'path';
import globby from 'globby';

const { requireTargetFile } = require('./requireTargetFile');

enum LogLevel {
  'warn' = 0,
  'info' = 1,
  'debug' = 2,
  'silent' = 3,
}

type ExtendInterceptOptions = {
  logLevel: LogLevel;
};

class ExtendLocalIntercept {
  private targetables: any;
  private componentsCache: Record<string, any> = {};
  private logLevel: LogLevel;

  constructor(
    targetables: any,
    options: ExtendInterceptOptions = { logLevel: LogLevel.warn },
  ) {
    this.targetables = targetables;
    this.logLevel = options.logLevel;
  }

  /**
   * @param string[] targetablesSearchPaths - array of paths to search for targetables
   * @param string fileExtension
   * @param string magentoPath
   */
  public allowCustomTargetables = async (
    fileExtension = '*.targetables.js',
    targetablesSearchPaths = ['src/components', 'src/RootComponents'],
    magentoPath = 'node_modules/@magento',
  ) => {
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

    paths.forEach(async (myPath: string) => {
      const relativePath = myPath
        .replace(pathReplacement, '')
        .replace(replaceRegex, `${magentoPath}/venia-ui/lib/$<type>`);
      const absolutePath = path.resolve(currentPath, relativePath);

      const stat = await fs.stat(absolutePath);
      if (stat && stat.isFile()) {
        const component = this.getReactComponent(
          relativePath.replace('node_modules/', ''),
        );

        this.log(
          LogLevel.debug,
          'Intercept',
          `${currentPath}/${myPath}`,
        );

        const componentInterceptor = requireTargetFile(
          `${currentPath}/${myPath}`,
        );

        componentInterceptor.interceptComponent(component);
      }
    });
  };

  /**
   * @param string[] targetablesSearchPaths - array of paths to search for targetables
   * @param string fileExtension
   * @param string magentoPath
   * @return
   */
  public allowCssOverwrites = async (
    fileExtension = '*.module.css',
    targetablesSearchPaths = ['src/components', 'src/RootComponents'],
    magentoPath = 'node_modules/@magento',
  ) => {
    const currentPath = process.cwd();
    const paths = await this.getPathsByFileExtension(
      fileExtension,
      targetablesSearchPaths,
    );

    const replaceRegex = this.buildRegex(targetablesSearchPaths);

    paths.forEach(async (myPath: string) => {
      const relativePath = myPath.replace(
        replaceRegex,
        `${magentoPath}/venia-ui/lib/$<type>`,
      );
      const absolutePath = path.resolve(currentPath, relativePath);

      const stat = await fs.stat(absolutePath);

      if (stat && stat.isFile()) {
        /**
         * This means we have matched a local file to something in venia-ui!
         * Find the JS  component from our CSS file name
         * */
        const jsComponent = relativePath
          .replace('node_modules/', '')
          .replace(fileExtension.substring(1), '.js');

        const eSModule = this.getReactComponent(jsComponent);
        /** Add import for our custom CSS classes */
        eSModule.addImport(`import localClasses from "${myPath}"`);

        /** Update the mergeClasses() method to inject our additional custom css */
        eSModule.insertAfterSource(
          'const classes = useStyle(defaultClasses, ',
          'localClasses, ',
        );
      }
    });
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
      this.log(
        LogLevel.warn,
        'No targetables found in',
        targetablesSearchPaths,
        fileExtension,
      );
    }

    return paths;
  }

  private log(level: LogLevel, message: string, ...args: any[]) {
    if (this.logLevel >= level) {
      switch (level) {
        case LogLevel.warn:
          console.warn(message, args);
          break;
        case LogLevel.info:
          console.log(message, args);
          break;
      }
    }
  }
}
// eslint-disable-next-line import/prefer-default-export
export { LogLevel, ExtendLocalIntercept };
module.exports.ExtendLocalIntercept = ExtendLocalIntercept;
