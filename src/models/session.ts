import { ISession } from 'connect-typeorm';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export default class Session implements ISession {
  @Index()
  @Column('bigint')
  public expiredAt: number = Date.now();

  @PrimaryColumn({ length: 255 })
  public id: string = '';

  @Column()
  public json: string = '';
}
