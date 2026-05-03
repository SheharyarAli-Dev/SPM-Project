import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(private readonly dataSource: DataSource) {}

  async getUserIdentity(userId: number) {
    // READ-ONLY query from centralised users and profiles tables
    // We do not own these tables — SELECT only
    const result = await this.dataSource.query(
      `
      SELECT
        u.id,
        u.uuid,
        u.email,
        u.first_name       AS "firstName",
        u.last_name        AS "lastName",
        u.display_name     AS "displayName",
        u.role,
        u.account_status   AS "accountStatus",
        u.country,
        p.profile_image_url AS "profileImageUrl",
        p.headline,
        p.trust_score      AS "trustScore",
        p.tier_level       AS "tierLevel",
        p.reputation_level AS "reputationLevel"
      FROM users u
      LEFT JOIN profiles p ON p.user_id = u.id
      WHERE u.id = $1
        AND u.deleted_at IS NULL
      LIMIT 1
      `,
      [userId],
    );

    if (!result || result.length === 0) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    return result[0];
  }
}
