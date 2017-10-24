import * as express from "express";
import * as http from "http";
import * as socketIo from "socket.io";
import * as path from "path";

export class Server {
    public static readonly PORT:number = 8989;
    public app: any;
    private server: any;
    private io: any;
    private port: string | number;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = http.createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || Server.PORT;
        this.app.use('/static', express.static('dist/static'))
        this.app.get('/', (req: Request, res: Response) => {
            res.sendFile(path.resolve(__dirname, '../dist/index.html'))
        })
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connect', (socket: any) => {
            console.log('Connected client on port %s.', this.port);
            socket.on('message', (m: Message) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }
}