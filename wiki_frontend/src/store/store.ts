import { create } from 'zustand';
import { IAdministrator, IArticle, IUser } from '../types/core.types';

export type User = IUser | IAdministrator;

interface UserState {
  users: User[];
  setUsers: (user: User[]) => void;
}

interface ArticleState {
  articles: IArticle[];
  setArticles: (articles: IArticle[]) => void;
}

interface AuthState {
  auth: {
    user: string;
    token: string;
  };
  setAuth: (auth: { user: string; token: string }) => void;
}

interface SearchState {
  keywords: string[];
  ids: number[];
  setKeywords: (keywords: string[]) => void;
  setIds: (ids: number[]) => void;
}

// ------------------------------------------ //

export const useUserStore = create<UserState>()((set) => ({
  users: [],
  setUsers: (users: User[]) => set({ users }),
}));

export const useArticleStore = create<ArticleState>()((set) => ({
  articles: [],
  setArticles: (articles: IArticle[]) => set({ articles }),
}));

export const useAuthStore = create<AuthState>()((set) => ({
  auth: {
    token: '',
    user: '',
  },
  setAuth: (auth: { user: string; token: string }) => set({ auth }),
}));

export const useSearchStore = create<SearchState>()((set) => ({
  keywords: [],
  ids: [],
  setKeywords: (keywords: string[]) => set({ keywords }),
  setIds: (ids: number[]) => set({ ids }),
}));
