import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  public id: number;
  @Column()
  public username: string;
  @Column()
  public email: string;
  @Column()
  public password: string;
  @Column({default: false})
  public isSuperuser: boolean;
}
