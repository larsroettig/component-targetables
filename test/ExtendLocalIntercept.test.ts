/* eslint-disable  */
import {ExtendLocalIntercept, LogLevel} from '../src';

const {requireTargetFile} = require('../src/requireTargetFile');

const FIXTURES_DIR = `${__dirname}/fixtures`;

const requireTargetFileCalls = new Map();
jest.mock('../src/requireTargetFile', () => {
    const requireTargetFile = (path: string) => {
        if (!requireTargetFileCalls.has(path)) {
            requireTargetFileCalls.set(path, jest.fn());
        }

        if (path.includes('no-export')) {
            return {};
        } else {
            return {
                interceptComponent: requireTargetFileCalls.get(path),
            };
        }
    };

    return {requireTargetFile};
});

// Temporary switch cwd
const changeCwd = (cwd: string) => {
    const originalCwd = process.cwd();
    process.chdir(cwd);
    return process.chdir.bind(process, originalCwd);
};

// Switch cwd to a fixture directory
const useFixture = (fixtureName: string) => {
    const fixtureDir = `${FIXTURES_DIR}/${fixtureName}`;
    const restoreCwd = changeCwd(fixtureDir);
    return {restoreCwd, fixtureDir};
};

beforeEach(() => {
    jest.resetModules();
});

test('Can create Instance without an Error', () => {
    const targetablesMock = {
        reactComponent: jest.fn(),
    };

    const extendLocalIntercept = new ExtendLocalIntercept(
        targetablesMock,
    );

    expect(extendLocalIntercept).toBeInstanceOf(ExtendLocalIntercept);
});

test('allowCustomTargetables', () => {
    const {restoreCwd} = useFixture('targetables');

    const reactComponentMock = {
        addImport: jest.fn(),
        insertAfterSource: jest.fn(),
    };

    const targetablesMock = {
        reactComponent: () => reactComponentMock,
    };

    const extendLocalIntercept = new ExtendLocalIntercept(
        targetablesMock,
    );

    extendLocalIntercept.allowCustomTargetables();
    extendLocalIntercept.allowCssOverwrites();

    expect(extendLocalIntercept).toBeInstanceOf(ExtendLocalIntercept);
    restoreCwd();
});

test('allowCustomTargetablesInDifferentDir', async () => {
    const {restoreCwd} = useFixture('targetables');

    const reactComponentMock = {
        addImport: jest.fn(),
        insertAfterSource: jest.fn(),
    };

    const targetablesMock = {
        reactComponent: () => reactComponentMock,
    };

    const extendLocalIntercept = new ExtendLocalIntercept(
        targetablesMock,
        {logLevel: LogLevel.debug},
    );

    await extendLocalIntercept.allowCustomTargetables(
        '*.my-targetables.js',
        ['extend-core/components'],
    );

    await extendLocalIntercept.allowCssOverwrites('*.my-module.css', [
        'extend-core/components',
    ]);

    expect(extendLocalIntercept).toBeInstanceOf(ExtendLocalIntercept);
    expect(requireTargetFileCalls.size).toBe(2);
    restoreCwd();
});

test('Handle forget to export interceptComponent', async () => {
    const {restoreCwd} = useFixture('targetables');

    const reactComponentMock = {
        addImport: jest.fn(),
        insertAfterSource: jest.fn(),
    };

    const targetablesMock = {
        reactComponent: () => reactComponentMock,
    };

    const extendLocalIntercept = new ExtendLocalIntercept(
        targetablesMock,
        {logLevel: LogLevel.debug},
    );

    await extendLocalIntercept.allowCustomTargetables(
        '*.targetables.js',
        ['no-export/no-export'],
    );

    expect(extendLocalIntercept).toBeInstanceOf(ExtendLocalIntercept);

    restoreCwd();
})
