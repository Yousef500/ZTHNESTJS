import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { TaskStatus } from './task.model';
import { TaskEntity } from './tasks.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private tasksRepository: Repository<TaskEntity>,
  ) {}

  async getTasks(filter: GetTasksFilterDto) {
    let tasks = await this.tasksRepository.find();

    if (Object.keys(filter)) {
      const { status, search } = filter;

      if (status) {
        tasks = tasks.filter((task) => (task.status = status));
      }

      if (search) {
        const term = search.toLowerCase();
        tasks = tasks.filter((task) => {
          if (
            task.title.toLowerCase().includes(term) ||
            task.description.toLowerCase().includes(term)
          ) {
            return true;
          }
          return false;
        });
      }
    }

    return tasks;
  }

  // async getTasksWithFilter(filterDto: GetTasksFilterDto) {

  //   const { status, search } = filterDto;

  //   // define a temporary array to hold the result
  //   let tasks = await this.getAllTasks();

  //   // do something with status
  //   if (status) {
  //     tasks = tasks.filter(task => task.status === status);
  //   }

  //   // do something with search
  //   if (search) {
  //     tasks = tasks.filter(task => {
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //         return true
  //       }
  //       return false;
  //     })
  //   }

  //   // return final result
  //   return {};
  // }

  async createTask(title: string, description: string) {
    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.tasksRepository.save(task);

    return task;
  }

  async getTaskById(id: string) {
    const task = await this.tasksRepository.findOne(id);
    if (!task) {
      throw new NotFoundException('No such task.');
    }
    return task;
  }

  async deleteTask(id: string) {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }

  async updateTaskById(id: string, status: TaskStatus) {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}
