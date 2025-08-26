import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export type RoleName = 'Admin' | 'Client' | 'Solver' | 'Supervisor';
export const Roles = (...roles: RoleName[]) => SetMetadata(ROLES_KEY, roles);
