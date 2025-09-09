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
        try {
            const tasks = await prisma.task.findMany();
            callback(null, { tasks });
        } catch (err) {
            callback(err, null);
        }
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
        const task = await prisma.task.findFirst({
            where: {
                id: call.request.id
            }
        })
        if (!task) {
            callback(null, { message: `Task not found with id: ${call.request.id}`, status: 404 });
            return;
        }
        else {
            const updatedTask = await prisma.task.update({
                where: {
                    id: call.request.id,
                },
                data: {
                    task: call.request.task,
                }
            })
            const response = {
                id: updatedTask.id,
                task: updatedTask.task,
                createdAt: updatedTask.createdAt.toISOString(),
                updatedAt: new Date().toISOString(), // Prisma won't auto-update unless you have updatedAt column
                message: "Task updated successfully",
                status: 200
            };
            callback(null, response);
        }
    }

}

export default TodoServices
