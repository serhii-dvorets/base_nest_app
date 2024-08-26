import { getUserCreds } from '../userCredentials';
import TestFactory from '../TestFactory';
import { RoleEnum } from 'src/modules/role/enums/role.enum';
import { TestingModule } from '@nestjs/testing';
import { Action } from '../../src/modules/action/entities/action.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';

describe('AuthController', () => {
  let testFactory: TestFactory;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    testFactory = new TestFactory();
    moduleFixture = await testFactory.init();
  });

  afterAll(async () => {
    await testFactory.clearAll();
    await testFactory.closeApp();
  });

  it('Should create a new user', async () => {
    const response = await testFactory.makeRequest({
      method: 'post',
      path: '/auth/signin',
      payload: getUserCreds(),
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      user: {
        name: 'userName',
        email: 'user@mail.com',
        password: '53ddf30466e1268f64fb18a97e1b1b70',
        role: { id: 3, name: 'user', description: 'User role' },
        id: 2,
        emailConfirmed: false,
      },
    });
  });

  it("Shouldn't create a user with not unique email", async () => {
    const response = await testFactory.makeRequest({
      method: 'post',
      path: '/auth/signin',
      payload: getUserCreds(),
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.fields).toEqual({
      field: 'email',
      messages: 'user@mail.com is not unique',
    });
  });

  it('Should login a user', async () => {
    const response = await testFactory.makeRequest({
      method: 'post',
      path: '/auth/login',
      payload: getUserCreds(),
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      user: {
        id: 2,
        name: 'userName',
        email: 'user@mail.com',
        password: '53ddf30466e1268f64fb18a97e1b1b70',
        emailConfirmed: false,
      },
    });
  });

  it("Shouldn't login a user with wrong email", async () => {
    const { password } = getUserCreds();
    const response = await testFactory.makeRequest({
      method: 'post',
      path: '/auth/login',
      payload: {
        password,
        email: 'wrong@mail.com',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual('User not found');
  });

  it("Shouldn't login a user with wrong password", async () => {
    const { email } = getUserCreds();
    const response = await testFactory.makeRequest({
      method: 'post',
      path: '/auth/login',
      payload: {
        password: 'wrong_password',
        email,
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual('Password is not correct');
  });

  it("Shouldn't login a user with wrong password", async () => {
    await testFactory.getSession(RoleEnum.User);

    const response = await testFactory.makeRequest({
      method: 'get',
      path: '/auth/logout',
      payload: {},
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual({ id: 2 });
  });

  it("Shouldn't connfirm email with wrond action id", async () => {
    await testFactory.getSession(RoleEnum.User);

    const userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );

    await testFactory.makeRequest({
      method: 'get',
      path: `/auth/confirm-email/12345`,
      payload: {},
    });

    const user = await userRepository.findOne({
      where: { id: 2 },
    });

    expect(user.emailConfirmed).toBe(false);
  });

  it('Should confirm email with correct action id', async () => {
    await testFactory.getSession(RoleEnum.User);

    const actionRepository = moduleFixture.get<Repository<Action>>(
      getRepositoryToken(Action),
    );

    const userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );

    const { id } = await actionRepository.findOne({
      where: { user: { id: 2 } },
    });

    await testFactory.makeRequest({
      method: 'get',
      path: `/auth/confirm-email/${id}`,
      payload: {},
    });

    const user = await userRepository.findOne({
      where: { id: 2 },
    });

    expect(user.emailConfirmed).toBe(true);
  });
});
