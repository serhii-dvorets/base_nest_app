import { User } from '../entities/user.entity';

export type ShowUserDto = {
  id: number;
  name: string;
  email: string;
  emailConfirmed: boolean;
  role: {
    id: number;
    name: string;
    description: string;
    permissions: string[];
  };
};

export const showUserDto = (data: User): ShowUserDto => {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    emailConfirmed: data.emailConfirmed,
    ...(data.role && {
      role: {
        id: data.role.id,
        name: data.role.name,
        description: data.role.description,
        permissions: data.role.permissions.map((permission) => permission.name),
      },
    }),
  };
};
