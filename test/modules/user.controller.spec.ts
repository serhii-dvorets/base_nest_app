import { getUserCreds } from '../userCredentials';
import TestFactory from '../TestFactory';
import { RoleEnum } from 'src/modules/role/enums/role.enum';

describe('UserController', () => {
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

  it('Should get all users', async () => {
    const response = await testFactory.makeRequest({
      method: 'get',
      path: '/user',
      payload: {},
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        name: 'superadmin',
        email: 'superadmin@mail.com',
        emailConfirmed: true,
        role: {
          id: 1,
          name: 'superadmin',
          description: 'Super admin role',
          permissions: [
            'view_permissions',
            'update_permissions',
            'view_role',
            'update_role',
            'view_user',
            'update_user',
            'view_product',
            'update_product',
          ],
        },
      },
    ]);
  });

  it('Should get one user', async () => {
    const response = await testFactory.makeRequest({
      method: 'get',
      path: '/user/1',
      payload: {},
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: 'superadmin',
      email: 'superadmin@mail.com',
      emailConfirmed: true,
      role: {
        id: 1,
        name: 'superadmin',
        description: 'Super admin role',
        permissions: [
          'view_permissions',
          'update_permissions',
          'view_role',
          'update_role',
          'view_user',
          'update_user',
          'view_product',
          'update_product',
        ],
      },
    });
  });

  it('Should update user', async () => {
    await testFactory.makeRequest({
      method: 'patch',
      path: '/user/1',
      payload: { name: 'Super admin name' },
    });

    const response = await testFactory.makeRequest({
      method: 'get',
      path: '/user/1',
      payload: {},
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual('Super admin name');
  });

  it("Should change user's role", async () => {
    const { body } = await testFactory.makeRequest({
      method: 'post',
      path: '/auth/signin',
      payload: getUserCreds(),
    });

    await testFactory.getSession(RoleEnum.SuperAdmin);

    const response = await testFactory.makeRequest({
      method: 'post',
      path: `/user/change-role/${body.id}`,
      payload: { role: 'admin' },
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      id: 2,
      name: 'userName',
      email: 'user@mail.com',
      emailConfirmed: false,
      role: {
        id: 2,
        name: 'admin',
        description: 'Admin role',
        permissions: [
          'view_user',
          'update_user',
          'view_product',
          'update_product',
        ],
      },
    });
  });

  it('Should delete user', async () => {
    await testFactory.makeRequest({
      method: 'delete',
      path: `/user/2`,
      payload: {},
    });

    const response = await testFactory.makeRequest({
      method: 'get',
      path: `/user/2`,
      payload: {},
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({});
  });

  it("Should not update the user's role for invalid value", async () => {
    const { body } = await testFactory.makeRequest({
      method: 'post',
      path: '/auth/signin',
      payload: getUserCreds(),
    });

    await testFactory.getSession(RoleEnum.SuperAdmin);

    const response = await testFactory.makeRequest({
      method: 'post',
      path: `/user/change-role/${body.id}`,
      payload: { role: 'driver' },
    });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('ROLE_NOT_FOUND');
  });

  it('Should not show users without session', async () => {
    await testFactory.logout();

    const response = await testFactory.makeRequest({
      method: 'get',
      path: `/user`,
      payload: {},
    });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toEqual('Forbidden resource');
  });
});
