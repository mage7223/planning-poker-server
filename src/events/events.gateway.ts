import { Logger } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from "socket.io";

@WebSocketGateway()
export class EventsGateway 
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer() io: Server;
  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
  }
  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }
  handleDisconnect(client: any) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }

  @SubscribeMessage('events')
  handleMessage(client: any, data: any) {
  this.logger.log(`Message received from client id: ${client.id}`);
  this.logger.debug(`Payload: ${data}`);
  return {
    event: "pong",
    data: `${data}123456`,
  };
  }
}
