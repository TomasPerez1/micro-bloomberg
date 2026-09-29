import {
  Global,
  Inject,
  Module,
  type OnApplicationShutdown,
} from '@nestjs/common';
import { Pool } from 'pg';

export const DATABASE_POOL = 'DATABASE_POOL';


@Global()
@Module({
  providers: [
    {
      provide: DATABASE_POOL,
      useFactory: async (): Promise<Pool> => {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
          throw new Error('Falta DATABASE_URL');
        }

        const pool = new Pool({ connectionString, max: 10 });

        // Verificamos la conexión
        const client = await pool.connect();
        try {
          await client.query('SELECT 1');
        } finally {
          client.release();
        }

        return pool;
      },
    },
  ],
  exports: [DATABASE_POOL],
})

export class DatabaseModule implements OnApplicationShutdown {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}
