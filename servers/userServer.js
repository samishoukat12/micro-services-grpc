import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
import UserServices from "../services/userService.js";

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load proto
const packageDef = protoLoader.loadSync(path.join(__dirname, "../proto/user.proto"));
const grpcObject = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObject.UserService;

// Create gRPC server
const server = new grpc.Server();
server.addService(userPackage.service, UserServices);

server.bindAsync("0.0.0.0:50052", grpc.ServerCredentials.createInsecure(), () => {
  console.log("🚀 gRPC Server running on port 50052");
  server.start();
});
