import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './tasks.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {}

    async getTaskById(
        id: number,
        user: User,
        ): Promise<Task>{
        const found = await this.taskRepository.findOne({where: {id, userId: user.id }});
        if(!found){
            throw new NotFoundException('Task with ID ' + id + ' not found');
        }
        return found;
    }

    async createTask(
        createTaskDto: CreateTaskDto,
        user: User,
        ): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async deleteTask(
        id: number,
        user: User,
        ): Promise<void>{
        const result = await this.taskRepository.delete({id, userId: user.id});
        if(result.affected === 0){
            throw new NotFoundException('Task with ID ' + id + ' not found');
        }
    }

    async updateTaskStatus(
        id: number, 
        status: TaskStatus,
        user: User,
        ): Promise<Task>{
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        return task;
    }

    async getTasks(
        filterDto: GetTasksFilterDto,
        user: User,
        ): Promise<Task[]>{
        return this.taskRepository.getTasks(filterDto, user);
    }

    // private tasks: Task[] = []; // property of this class

    // getAllTasks(): Task[]{
    //     return this.tasks;
    // }

    // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[]{
    //     const {status, search} = filterDto;

    //     let tasks = this.getAllTasks();
    //     if(status){
    //         tasks = tasks.filter(task => task.status === status);
    //     }
    //     if(search){
    //         tasks = tasks.filter(task => 
    //             task.title.includes(search) ||
    //             task.description.includes(search)
    //             );
    //     }

    //     return tasks;
    // }

    // getTaskById(id: string): Task {
    //     const found = this.tasks.find(task => task.id === id);
    //     if(!found){
    //         throw new NotFoundException('Task with ID ' + id + ' not found');
    //     }
    //     return found;
    // }

     
    // createTask(title:string, description:string):Task{
    //     const task: Task = {
    //         id: uuid.v1(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN
    //     };
    //     this.tasks.push(task);
    //     return task;
    // }

    // } 

    // createTask(createTaskDto: CreateTaskDto):Task{
        
    //     const {title, description} = createTaskDto;
        
    //     const task: Task = {
    //         id: uuid.v1(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN
    //     };
    //     this.tasks.push(task);
    //     return task;
    // }

    // deleteTask(id: string): void {
    //     const found = this.getTaskById(id);
    //     this.tasks = this.tasks.filter(task => task.id !== found.id);
    // }

    // updateTaskStatus(id: string, status: TaskStatus): Task{
    //     const task = this.getTaskById(id);
    //     task.status = status;
    //     return task;
    // }

}
