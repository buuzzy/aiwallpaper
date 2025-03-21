import { User } from "./user";

export interface Wallpaper {
  id?: number;
  user_email: string;
  user_name?: string;
  user_avatar?: string;
  img_description: string;
  img_size: string;
  img_url: string;
  llm_name: string;
  llm_params: any;
  created_at: string;
  created_user?: {
    email: string;
    nickname?: string;
    avatar_url?: string;
  };
}