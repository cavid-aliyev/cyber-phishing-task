import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PhishingAttempt } from '../../phishing/schemas/phishing-attempt.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PhishingStatusGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger = new Logger('PhishingStatusGateway');

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  notifyStatusChange(phishingAttempt: PhishingAttempt) {
    this.server.emit('phishing-status-changed', {
      trackingId: phishingAttempt.trackingId,
      status: phishingAttempt.status,
      email: phishingAttempt.email,
      clickedAt: phishingAttempt.clickedAt,
      templateId: phishingAttempt.templateId,
    });
  }
}
