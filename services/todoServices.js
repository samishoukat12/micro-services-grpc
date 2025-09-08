import { PrismaClient } from "@prisma/client";

let tasks = [];
const prisma = new PrismaClient()
const TodoServices = {
    AddTodo: async (call, callback) => {
        await prisma.task.create({
            data: {
                task: call.request.task,
            }
        })
        tasks.push(call.request.task);
        callback(null, { message: `Task added: ${call.request.task}` });
    },

    ListTodos: async (call, callback) => {
        const tasks = await prisma.task.findMany();
        console.log(tasks)
        callback(null, {tasks});
    },
    DeleteTodo: async (call, callback) => {
        await prisma.task.delete({
            where: {
                id: call.request.id,
            }
        })
        callback(null, { message: `Task deleted: ${call.request.id}` });
    },
    UpdateTodo: async (call, callback) => {
        await prisma.task.update({
            where: {
                id: call.request.id,
            },
            data: {
                task: call.request.task,
            }
        })
        callback(null, { message: `Task updated: ${call.request.id}` });
    }

}

export default TodoServices
