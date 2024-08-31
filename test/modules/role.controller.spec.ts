import TestFactory from '../TestFactory';
import { RoleEnum } from 'src/modules/role/enums/role.enum';

describe('RoleController', () => {
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

  it('Should get all roles', async () => {
    const response = await testFactory.makeRequest({
      method: 'get',
      path: '/role',
      payload: {},
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: 'superadmin', description: 'Super admin role' },
      { id: 2, name: 'admin', description: 'Admin role' },
      { id: 3, name: 'user', description: 'User role' },
    ]);
  });

  it('Should get one role', async () => {
    const response = await testFactory.makeRequest({
      method: 'get',
      path: '/role/1',
      payload: {},
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: 'superadmin',
      description: 'Super admin role',
      permissions: [
        { id: 1, name: 'view_permissions' },
        { id: 2, name: 'update_permissions' },
        { id: 3, name: 'view_role' },
        { id: 4, name: 'update_role' },
        { id: 5, name: 'view_user' },
        { id: 6, name: 'update_user' },
        { id: 7, name: 'view_product' },
        { id: 8, name: 'update_product' },
      ],
    });
  });

  it('Should create new role', async () => {
    const response = await testFactory.makeRequest({
      method: 'post',
      path: '/role',
      payload: {
        name: 'accountant',
        description: 'Role for accountant',
        permissionIds: [1, 2],
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      name: 'accountant',
      description: 'Role for accountant',
      id: 4,
      permissions: [
        { id: 1, name: 'view_permissions' },
        { id: 2, name: 'update_permissions' },
      ],
    });
  });

  it('Should update role', async () => {
    await testFactory.makeRequest({
      method: 'patch',
      path: '/role/4',
      payload: { name: 'cfo', permissionIds: [1] },
    });

    const response = await testFactory.makeRequest({
      method: 'get',
      path: '/role/4',
      payload: {},
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: 4,
      name: 'cfo',
      description: 'Role for accountant',
      permissions: [{ id: 1, name: 'view_permissions' }],
    });
  });

  it('Should delete role', async () => {
    await testFactory.makeRequest({
      method: 'delete',
      path: '/role/4',
      payload: {},
    });

    const response = await testFactory.makeRequest({
      method: 'get',
      path: '/role/4',
      payload: {},
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({});
  });

  it('Should protect the show all role endpoint with session requirement', async () => {
    await testFactory.logout();

    const response = await testFactory.makeRequest({
      method: 'get',
      path: '/role',
      payload: {},
    });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toEqual('Forbidden resource');
  });

  it('Shouldn protect the role update endpoint from users with user role', async () => {
    await testFactory.getSession(RoleEnum.User);

    const response = await testFactory.makeRequest({
      method: 'patch',
      path: '/role/2',
      payload: { name: 'updated_name' },
    });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toEqual('Forbidden resource');
  });
});
