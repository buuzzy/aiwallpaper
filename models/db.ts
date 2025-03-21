import { Pool } from "pg";

// 扩展 Error 类型以包含 code 属性
interface DatabaseError extends Error {
  code?: string;
}

// 全局连接池
let globalPool: Pool | null = null;

export async function getDb(): Promise<Pool> {
  if (!globalPool) {
    try {
      console.log("初始化数据库连接池...");
      
      // 使用 Session Pooler 连接
      globalPool = new Pool({
        user: 'postgres.qrtgtpmkyrbyrkjfaefc',
        password: 'ZqIS6AEhhnBB6NLB',
        host: 'aws-0-ap-southeast-1.pooler.supabase.com',
        port: 5432, // Session Pooler 使用 5432 端口
        database: 'postgres',
        ssl: {
          rejectUnauthorized: false
        },
        connectionTimeoutMillis: 10000,
      });
      
      // 测试连接
      try {
        const client = await globalPool.connect();
        console.log("数据库连接测试成功");
        client.release();
      } catch (testError) {
        console.error("数据库连接测试失败:", testError);
        globalPool = null;
        throw testError;
      }
      
      globalPool.on('error', (err: DatabaseError) => {
        console.error('数据库连接池错误:', err);
        if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.code === 'ENETUNREACH') {
          console.log('数据库连接失败，将在下次查询时重新连接');
          globalPool = null;
        }
      });
    } catch (error) {
      console.error("初始化数据库连接失败:", error);
      throw error;
    }
  }

  if (!globalPool) {
    throw new Error("无法创建数据库连接池");
  }

  return globalPool;
}

// 添加一个测试连接的函数
export async function testDbConnection(): Promise<boolean> {
  try {
    const pool = await getDb();
    const client = await pool.connect();
    const result = await client.query('SELECT 1 as connection_test');
    console.log("数据库连接测试成功:", result.rows[0]);
    client.release();
    return true;
  } catch (error) {
    console.error("数据库连接测试失败:", error);
    return false;
  }
}