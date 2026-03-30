import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateEmailToIdentifier1701234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "identifier" varchar,
      ADD COLUMN "identifierType" enum_users_identifiertype DEFAULT 'email'
    `);

    // Migrate existing email data to identifier
    await queryRunner.query(`
      UPDATE "users"
      SET "identifier" = "email",
          "identifierType" = 'email'
      WHERE "email" IS NOT NULL
    `);

    // Make identifier unique
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD CONSTRAINT "UQ_identifier" UNIQUE ("identifier")
    `);

    // Drop old email column and constraint
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "email"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert: add email column back
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "email" varchar
    `);

    // Migrate identifier back to email
    await queryRunner.query(`
      UPDATE "users"
      SET "email" = "identifier"
      WHERE "identifier" IS NOT NULL AND "identifierType" = 'email'
    `);

    // Add email unique constraint
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("email")
    `);

    // Drop new columns
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP CONSTRAINT "UQ_identifier"
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "identifier",
      DROP COLUMN "identifierType"
    `);
  }
}
