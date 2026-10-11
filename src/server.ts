import express, { Express, Request, Response } from 'express';
import routes from './routes';

class Server {
  private app: Express;
  constructor(private port: number) {
    this.app = express();
    this.app.use(express.json());
    this.app.use('/api/v1', routes);
    this.app.get('/', (_req: Request, res: Response) => res.status(200).json({
      ok: true,
      message: 'Products API is running',
      endpoints: {
        products: '/api/v1/products',
        health: '/health'
      }
    }));
    this.app.get('/health', (_req: Request, res: Response) => res.status(200).json({ ok: true }));
  }
  start(): void {
    this.app.listen(this.port, () => console.log(`Servidor en http://localhost:${this.port}`));
  }
}
export default Server;
