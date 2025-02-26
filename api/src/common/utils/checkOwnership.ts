import { UnauthorizedException } from '@nestjs/common';
import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';

export default async function checkOwnership<T extends ObjectLiteral>(
  user: any,
  entityClass: EntityTarget<T>,
  entityId: number,
  dataSource: DataSource,
) {
  if (user.email === process.env.ADMIN_EMAIL) {
    return true;
  }

  const target = await dataSource.manager.findOneBy(entityClass, {
    id: entityId,
  } as any);

  if (!target) {
    throw new Error('Entity not found');
  }
  
  if (target.userId != user.id) {
    throw new UnauthorizedException('권한이 없습니다.');
  }
  return true;
}
