import { Test, TestingModule } from '@nestjs/testing';
import { EventsGateway } from './events.gateway';
import { INestApplication } from "@nestjs/common";
import { io, Socket } from 'socket.io-client';


async function createNestApp(...gateways: any): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    providers: gateways,
  }).compile();
  return testingModule.createNestApplication();
}

describe('EventsGateway', () => {
  let gateway: EventsGateway;
  let app: INestApplication;
  let ioClient: Socket;

  beforeAll(async () => {
    // Instantiate the app
    app = await createNestApp(EventsGateway);
    // Get the gateway instance from the app instance
    gateway = app.get<EventsGateway>(EventsGateway);
    // Create a new client that will interact with the gateway

    ioClient = io("http://localhost:3000", {
      autoConnect: false,
      transports: ["websocket", "polling"],
    });

    app.listen(3000);
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be defined", () => {
    expect(gateway).toBeDefined();
  });

  it('should emit "pong" on "ping"', async () => {
    ioClient.connect();
    ioClient.emit("events", "Hello world!");
    await new Promise<void>((resolve, reject) => {
      ioClient.on("connect", () => {
        console.log("connected");
      });
      ioClient.on("pong", (data) => {
        try{
          expect(data).toBe("Hello world!123456");
          resolve();
        } catch (ex){
          reject(ex);
        }
      });
    });
    ioClient.disconnect();
  });
});