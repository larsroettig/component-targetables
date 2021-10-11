/* eslint-disable  */
import { ExtendLocalIntercept } from '../src/index';
const { requireTargetFile } = require('../src/requireTargetFile');

jest.mock('../src/requireTargetFile', () => {
  const requireTargetFile = (): any => {
    return {
      interceptComponent: jest.fn(),
    };
  };

  return { requireTargetFile };
});

const FIXTURES_DIR = `${__dirname}/fixtures`;

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
  return { restoreCwd, fixtureDir };
};

beforeEach(() => {
  jest.resetModules();
});

test('Can create Intance without an Error', () => {
  const targetablesMock = {
    reactComponent: jest.fn(),
  };

  const extendLocalIntercept = new ExtendLocalIntercept(
    targetablesMock,
  );

  expect(extendLocalIntercept).toBeInstanceOf(ExtendLocalIntercept);
});

test('allowCustomTargetables', async () => {
  const { restoreCwd } = useFixture('targetables');

  const targetablesMock = {
    reactComponent: jest.fn(),
  };

  const extendLocalIntercept = new ExtendLocalIntercept(
    targetablesMock,
  );

  extendLocalIntercept.allowCustomTargetables(['src/components']);
  extendLocalIntercept.allowCssOverwrites();

  expect(extendLocalIntercept).toBeInstanceOf(ExtendLocalIntercept);
  restoreCwd();
});
