import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './task.model';

@Entity()
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne((_type) => User, (user) => user.tasks, { eager: false })
  user: User;
}
