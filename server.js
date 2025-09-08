// server/server.js
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
import TodoServices from "./services/todoServices.js";

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load proto
const packageDef = protoLoader.loadSync(path.join(__dirname, "./proto/todo.proto"));
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.TodoService;

// Create gRPC server
const server = new grpc.Server();
server.addService(todoPackage.service, TodoServices);

server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () => {
  console.log("🚀 gRPC Server running on port 50051");
  server.start();
});
