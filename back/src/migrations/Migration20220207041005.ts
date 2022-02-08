import { Migration } from '@mikro-orm/migrations';

export class Migration20220207041005 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_password_unique";');

    this.addSql('alter table "user" add constraint "user_name_unique" unique ("name");');
  }

}
