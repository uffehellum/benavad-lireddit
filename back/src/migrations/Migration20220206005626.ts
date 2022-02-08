import { Migration } from '@mikro-orm/migrations';

export class Migration20220206005626 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" rename column "_id" to "id";');
  }

}
