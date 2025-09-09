# gRPC Todo Demo

A minimal gRPC Todo service built with Node.js, @grpc/grpc-js, Prisma, and PostgreSQL. It exposes CRUD-style RPCs to create, list, update, delete, and fetch a single task.

## Tech stack
- Node.js (ES Modules)
- gRPC for Node.js: `@grpc/grpc-js` + `@grpc/proto-loader`
- Prisma ORM with PostgreSQL
- Nodemon for local development

## Project structure
```
grpc-todo-demo/
├── dbClient/
│   └── prismaClient.js
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── proto/
│   └── todo.proto
├── services/
│   └── todoServices.js
├── server.js
├── package.json
└── README.md
```

## Prerequisites
- Node.js and npm installed (Node 18+ recommended)
- A running PostgreSQL instance

## Setup
1) Clone and install dependencies
```
npm install
```

2) Configure database
Create a `.env` file in the project root with your PostgreSQL connection string:
```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DB_NAME?schema=public"
```

3) Apply database migrations (and generate Prisma client)
```
npm run prisma
```
This runs `prisma migrate dev --name init` and generates the Prisma client.

## Run the server
- Development (auto-restart)
```
npm run dev
```
- Production
```
npm start
```
The gRPC server listens on `0.0.0.0:50051` and logs:
```
🚀 gRPC Server running on port 50051
```

## Proto definitions
File: `proto/todo.proto`

Service: `TodoService`
- `AddTodo(TodoRequest) -> TodoResponse`
- `ListTodos(Empty) -> TodoList`
- `UpdateTodo(UpdateTodoRequest) -> UpdateTodoResponse`
- `DeleteTodo(DeleteTodoRequest) -> DeleteTodoResponse`
- `SingleTask(SingleTaskRequest) -> SingleTaskResponse`

Messages (high-level):
- `TodoRequest { string task }`
- `TodoResponse { string message }`
- `UpdateTodoRequest { int32 id, string task }`
- `UpdateTodoResponse { int32 id, string task, string createdAt, string updatedAt, string message, int32 status }`
- `DeleteTodoRequest { int32 id }`
- `DeleteTodoResponse { string message }`
- `SingleTaskRequest { int32 id }`
- `SingleTaskResponse { int32 id, string task, string createdAt, string updatedAt, string message, int32 status }`
- `Todo { int32 id, string task, string createdAt }`
- `TodoList { repeated Todo tasks }`
- `Empty {}`

## Quick testing with grpcurl
You can use `grpcurl` to call the service locally without writing a client. Install grpcurl, then run the commands below from the project root.

- Add a task
```
grpcurl -plaintext \
  -import-path ./proto -proto todo.proto \
  -d '{"task":"Buy milk"}' \
  localhost:50051 TodoService.AddTodo
```

- List tasks
```
grpcurl -plaintext \
  -import-path ./proto -proto todo.proto \
  -d '{}' \
  localhost:50051 TodoService.ListTodos
```

- Update a task (ID 1)
```
grpcurl -plaintext \
  -import-path ./proto -proto todo.proto \
  -d '{"id":1, "task":"Buy bread"}' \
  localhost:50051 TodoService.UpdateTodo
```

- Get a single task (ID 1)
```
grpcurl -plaintext \
  -import-path ./proto -proto todo.proto \
  -d '{"id":1}' \
  localhost:50051 TodoService.SingleTask
```

- Delete a task (ID 1)
```
grpcurl -plaintext \
  -import-path ./proto -proto todo.proto \
  -d '{"id":1}' \
  localhost:50051 TodoService.DeleteTodo
```

## Implementation notes
- This project uses ES Modules; `server.js` adjusts `__dirname` via `fileURLToPath` and `path` utilities.
- Prisma models live in `prisma/schema.prisma`. Migrations are created/applied via `npm run prisma`.
- The service implementation is in `services/todoServices.js` and is registered in `server.js`.

## Troubleshooting
- Database connection errors: ensure `DATABASE_URL` is correct and the database is reachable.
- Prisma errors after schema changes: re-run `npm run prisma` to apply migrations and regenerate the client.
- Port conflicts: make sure nothing else is listening on `50051`.

## License
ISC