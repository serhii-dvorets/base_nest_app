import TestFactory from '../TestFactory';
import { RoleEnum } from 'src/modules/role/enums/role.enum';

describe('AuthController', () => {
  let testFactory: TestFactory;

  beforeAll(async () => {
    testFactory = new TestFactory();
    await testFactory.init();
    await testFactory.getSession(RoleEnum.SuperAdmin);
  });

  afterAll(async () => {
    await testFactory.clearAll();
    await testFactory.closeApp();
  });

  it('/ (GET)', async () => {
    const response = await testFactory.makeRequest({
      method: 'get',
      path: '/role',
      payload: {},
    });

    expect(response.statusCode).toBe(200);
  });
});
