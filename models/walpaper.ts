import { QueryResult, QueryResultRow } from "pg";

import { Wallpaper } from "@/types/wallpaper";
import { getDb } from "./db";

export async function insertWallpaper(wallpaper: Wallpaper) {
  try {
    const db = await getDb();
    
    // 确保 db 是一个有效的 Pool 对象
    if (!db || typeof db.query !== 'function') {
      throw new Error("数据库连接无效");
    }
    
    const res = await db.query(
      `INSERT INTO wallpapers 
          (user_email, user_name, user_avatar, img_description, img_size, img_url, llm_name, llm_params, created_at) 
          VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id
      `,
      [
        wallpaper.user_email,
        wallpaper.user_name,
        wallpaper.user_avatar,
        wallpaper.img_description,
        wallpaper.img_size,
        wallpaper.img_url,
        wallpaper.llm_name,
        wallpaper.llm_params,
        wallpaper.created_at,
      ]
    );

    return res;
  } catch (error) {
    console.error("插入壁纸数据失败:", error);
    throw error;
  }
}

export async function getWallpapersCount(): Promise<number> {
  const db = await getDb();
  const res = await db.query(`SELECT count(1) as count FROM wallpapers`);
  if (res.rowCount === 0) {
    return 0;
  }

  const { rows } = res;
  const row = rows[0];

  return row.count;
}

export async function getUserWallpapersCount(
  user_email: string
): Promise<number> {
  const db = await getDb();
  const res = await db.query(
    `SELECT count(1) as count FROM wallpapers WHERE user_email = $1`,
    [user_email]
  );
  if (res.rowCount === 0) {
    return 0;
  }

  const { rows } = res;
  const row = rows[0];

  return row.count;
}

export async function getWallpapers(
  page: number,
  limit: number
): Promise<Wallpaper[] | undefined> {
  if (page < 1) {
    page = 1;
  }
  if (limit <= 0) {
    limit = 50;
  }
  const offset = (page - 1) * limit;

  const db = await getDb();
  const res = await db.query(
    `SELECT * FROM wallpapers ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  
  if (res.rowCount === 0) {
    return undefined;
  }

  const wallpapers = getWallpapersFromSqlResult(res);

  return wallpapers;
}

export function getWallpapersFromSqlResult(
  res: QueryResult<QueryResultRow>
): Wallpaper[] {
  if (!res.rowCount || res.rowCount === 0) {
    return [];
  }

  const wallpapers: Wallpaper[] = [];
  const { rows } = res;
  rows.forEach((row) => {
    const wallpaper = formatWallpaper(row);
    if (wallpaper) {
      wallpapers.push(wallpaper);
    }
  });

  return wallpapers;
}

export function formatWallpaper(row: QueryResultRow): Wallpaper | undefined {
  let wallpaper: Wallpaper = {
    id: row.id,
    user_email: row.user_email,
    img_description: row.img_description,
    img_size: row.img_size,
    img_url: row.img_url,
    llm_name: row.llm_name,
    llm_params: row.llm_params,
    created_at: row.created_at,
    user_name: row.user_name || "AI User",
    user_avatar: row.user_avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (row.user_email || "AI")
  };

  if (row.user_name || row.user_avatar) {
    wallpaper.created_user = {
      email: row.user_email,
      nickname: row.user_name || "AI User",
      avatar_url: row.user_avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (row.user_email || "AI")
    };
  }

  try {
    wallpaper.llm_params = JSON.parse(JSON.stringify(wallpaper.llm_params));
  } catch (e) {
    console.log("parse wallpaper llm_params failed: ", e);
  }

  return wallpaper;
}