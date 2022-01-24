const path = require('path');
const globby = require('globby');
const { stat: fsStat } = require('fs/promises');
const { requireTargetFile } = require('./requireTargetFile');

enum LogLevel {
  'none' = -1,
  'warn' = 0,
  'debug' = 2,
}

type ExtendInterceptOptions = {
  logLevel: LogLevel;
};

class ExtendLocalIntercept {
  private targetables: any;

  private componentsCache: Record<string, any> = {};

  private readonly logLevel: LogLevel;

  constructor(
    targetables: any,
    options: ExtendInterceptOptions = { logLevel: LogLevel.none },
  ) {
    this.targetables = targetables;
    this.logLevel = options.logLevel;
  }

  /**
   * @param fileExtension
   * @param targetablesSearchPaths
   * @param magentoPath
   */
  public allowCustomTargetables = async (
    fileExtension = '*.targetables.js',
    targetablesSearchPaths = ['src/components', 'src/RootComponents'],
    magentoPath = 'node_modules/@magento',
  ) => {
    const currentPath = process.cwd();
    const paths = await ExtendLocalIntercept.getPathsByFileExtension(
      fileExtension,
      targetablesSearchPaths,
    );

    const replaceRegex = this.buildRegex(targetablesSearchPaths);

    const pathReplacement = fileExtension.substring(
      1,
      fileExtension.length - 3,
    );

    const callBack = (file: string) =>
      file
        .replace(pathReplacement, '')
        .replace(replaceRegex, `${magentoPath}/venia-ui/lib/$<type>`);

    const compListMap = await this.resolveCoreFiles(paths, callBack);
    compListMap.forEach((props) => {
      const { relativePath, myPath } = props;
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

      if (
        componentInterceptor &&
        componentInterceptor.interceptComponent
      ) {
        componentInterceptor.interceptComponent(component);
      } else {
        this.log(
          LogLevel.warn,
          'No interceptComponent export in',
          `${currentPath}/${myPath}`,
        );
      }
    });
  };

  /**
   * @param fileExtension
   * @param targetablesSearchPaths
   * @param magentoPath
   */
  public allowCssOverwrites = async (
    fileExtension = '*.module.css',
    targetablesSearchPaths = ['src/components', 'src/RootComponents'],
    magentoPath = 'node_modules/@magento',
  ) => {
    const paths = await ExtendLocalIntercept.getPathsByFileExtension(
      fileExtension,
      targetablesSearchPaths,
    );

    const replaceRegex = this.buildRegex(targetablesSearchPaths);
    const callBack = (file: string) =>
      file.replace(
        replaceRegex,
        `${magentoPath}/venia-ui/lib/$<type>`,
      );

    const compListMap = await this.resolveCoreFiles(paths, callBack);

    compListMap.forEach((props) => {
      const { relativePath, myPath } = props;

      /* This means we have matched a local file to something in venia-ui!
       * Find the JS  component from our CSS file name
       */
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
    });
  };

  private resolveCoreFiles = async (
    paths: string[],
    callBack: (path: string) => string,
  ) => {
    const currentPath = process.cwd();

    const relativePathMap: {
      myPath: string;
      relativePath: string;
    }[] = [];

    await Promise.all(
      paths.map(async (myPath: string) => {
        const relativePath = callBack(myPath);
        const absolutePath = path.resolve(currentPath, relativePath);

        try {
          const stat = await fsStat(absolutePath);
          if (stat && stat.isFile()) {
            relativePathMap.push({ myPath, relativePath });
          }
        } catch (error) {
          this.log(
            LogLevel.warn,
            'File not exits in core',
            absolutePath,
          );
        }
      }),
    );

    return relativePathMap;
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

  private static async getPathsByFileExtension(
    fileExtension: string,
    targetablesSearchPaths: string[],
  ) {
    return globby(targetablesSearchPaths, {
      expandDirectories: {
        files: [fileExtension],
      },
    });
  }

  private log(level: LogLevel, message: string, ...args: any[]) {
    if (this.logLevel >= level) {
      // eslint-disable-next-line default-case
      switch (level) {
        case LogLevel.warn:
          // eslint-disable-next-line no-console
          console.warn(message, args);
          break;
        case LogLevel.debug:
          // eslint-disable-next-line no-console
          console.debug(message, args);
          break;
      }
    }
  }
}

// eslint-disable-next-line import/prefer-default-export
export { LogLevel, ExtendLocalIntercept };
module.exports.ExtendLocalIntercept = ExtendLocalIntercept;
