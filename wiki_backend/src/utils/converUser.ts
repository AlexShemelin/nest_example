import { IUser, IAdministrator, BaseUser } from '../types/core.types';
import { User } from '@prisma/client';

// Function to convert Prisma User model to IUser or IAdministrator
export function prismaToUser(prismaUser: User): IUser | IAdministrator {
  const baseUser: BaseUser = {
    id: prismaUser.id,
    username: prismaUser.username,
    password: prismaUser.password,
    token: prismaUser.token,
  };

  const userAccess = {
    create: prismaUser.accessCreate,
    edit: prismaUser.accessEdit,
    delete: prismaUser.accessDelete,
  };

  if (prismaUser.administrator) {
    return {
      ...baseUser,
      access: userAccess,
      administrator: true,
    } as IAdministrator;
  } else {
    return {
      ...baseUser,
      access: userAccess,
      administrator: false,
    } as IUser;
  }
}

// Function to convert IUser or IAdministrator to Prisma User model
export function userToPrisma(user: IUser | IAdministrator): User {
  return {
    id: user.id,
    username: user.username,
    password: user.password,
    token: user.token,
    accessCreate: user.access.create,
    accessEdit: user.access.edit,
    accessDelete: user.access.delete,
    administrator: user.administrator,
  };
}
