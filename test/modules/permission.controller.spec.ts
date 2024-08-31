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

  it('Should get all permissions', async () => {
    const response = await testFactory.makeRequest({
      method: 'get',
      path: '/permission',
      payload: {},
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      { id: 2, name: 'update_permissions' },
      { id: 8, name: 'update_product' },
      { id: 4, name: 'update_role' },
      { id: 6, name: 'update_user' },
      { id: 1, name: 'view_permissions' },
      { id: 7, name: 'view_product' },
      { id: 3, name: 'view_role' },
      { id: 5, name: 'view_user' },
    ]);
  });

  it('Should get one permission', async () => {
    const response = await testFactory.makeRequest({
      method: 'get',
      path: '/permission/2',
      payload: {},
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: 2, name: 'update_permissions' });
  });

  it('Should create new permission', async () => {
    const response = await testFactory.makeRequest({
      method: 'post',
      path: '/permission',
      payload: { name: 'view_report' },
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ name: 'view_report', id: 9 });
  });

  it('Should update permission', async () => {
    await testFactory.makeRequest({
      method: 'patch',
      path: '/permission/9',
      payload: { name: 'update_report' },
    });

    const response = await testFactory.makeRequest({
      method: 'get',
      path: '/permission/9',
      payload: {},
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ name: 'update_report', id: 9 });
  });

  it('Should delete permission', async () => {
    await testFactory.makeRequest({
      method: 'delete',
      path: '/permission/9',
      payload: {},
    });

    const response = await testFactory.makeRequest({
      method: 'get',
      path: '/permission/9',
      payload: {},
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({});
  });

  it('Should protect the show all permissions endpoint with session requirement', async () => {
    await testFactory.logout();

    const response = await testFactory.makeRequest({
      method: 'get',
      path: '/permission',
      payload: {},
    });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toEqual('Forbidden resource');
  });

  it('Shouldn protect the permissions update endpoint from users with user role', async () => {
    await testFactory.getSession(RoleEnum.User);

    const response = await testFactory.makeRequest({
      method: 'patch',
      path: '/permission/2',
      payload: { name: 'updated_name' },
    });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toEqual('Forbidden resource');
  });
});
