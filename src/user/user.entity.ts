import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ length: 60 })
  firstname: string;

  @Column({ length: 60 })
  lastname: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column()
  pwdHash: string;

  @Column({ default: null, nullable: true })
  currentTokenId: string | null;
}
