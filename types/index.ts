export type UserRole = 'viewer' | 'author' | 'admin';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  body: string;
  summary: string | null;
  image_url: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
  author?: Profile;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_id?: string | null;
  created_at: string;
  user?: Profile;
}
