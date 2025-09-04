import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({ namespace: "/assignments", cors: true })
export class AssignmentsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  handleConnection(client: any) {
    // Cliente conectado
  }

  handleDisconnect(client: any) {
    // Cliente desconectado
  }

  emitAssignmentChange(data: any) {
    this.server.emit("assignmentChange", data);
  }
}
