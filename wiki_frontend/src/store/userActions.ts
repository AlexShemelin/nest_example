import { useArticleStore, useUserStore, useAuthStore, useSearchStore } from './store';
import { IArticle, IUser } from '../types/core.types';

export const getCurrentAuthState = () => {
  const authData = window.apiClient.getCurentUserData() as {
    user: string;
    token: string;
  };
  useAuthStore.setState({ auth: authData });
  return authData;
};

export const loginAction = async (username: string, password: string) => {
  const result = await window.apiClient.loginUser({
    username,
    password,
  });
  if (result?.status === 500) {
    return {
      status: 500,
      message: result?.message,
    };
  }
  useAuthStore.setState({
    auth: {
      user: username,
      token: result.message,
    },
  });
  return result;
};

export const logoutAction = async () => {
  await window.apiClient.logout();
  useAuthStore.setState({
    auth: {
      token: '',
      user: '',
    },
  });
};

export const getAllUsers = async () => {
  const newUsers = (await window.apiClient.getAllUsers()) as IUser[];
  useUserStore.setState({ users: newUsers });
};

export const getAllArticles = async () => {
  const newArticles = (await window.apiClient.getAllArticles()) as IArticle[];
  useArticleStore.setState({ articles: newArticles });
};

export const handleSubmitEditUser = async (data: Record<string, string>) => {
  const accessArray = data['create/edit/delete'].split('/');
  const authData = window.apiClient.getCurentUserData() as {
    user: string;
    token: string;
  };
  await window.apiClient.editUser({
    editorUsername: authData.user,
    username: data.username,
    access: {
      create: accessArray[0] === 'true',
      edit: accessArray[1] === 'true',
      delete: accessArray[2] === 'true',
    },
    id: Number(data.id),
  });
  await getAllUsers();
};

export const handleSubmitEditArticle = async (data: Record<string, string>) => {
  const authData = window.apiClient.getCurentUserData() as {
    user: string;
    token: string;
  };
  await window.apiClient.editArticle({
    editorUsername: authData.user,
    id: Number(data.id),
    title: data.title,
    authorId: 1,
    body: data.body,
    tags: data.tags.split(','),
    created: new Date(),
    edited: new Date(),
    imageUrl: data.imageUrl,
    published: true,
  });
  await getAllArticles();
};

export const handleSubmitAddUser = async (data: Record<string, string>) => {
  const accessArray = data['create/edit/delete'].split('/');
  const authData = window.apiClient.getCurentUserData() as {
    user: string;
    token: string;
  };
  await window.apiClient.createUser({
    editorUsername: authData.user,
    username: data.username,
    access: {
      create: accessArray[0] === 'true',
      edit: accessArray[1] === 'true',
      delete: accessArray[2] === 'true',
    },
    password: data.password,
  });
  await getAllUsers();
};

export const handleSubmitAddArticle = async (data: Record<string, string>) => {
  const authData = window.apiClient.getCurentUserData() as {
    user: string;
    token: string;
  };
  await window.apiClient.createArticle({
    editorUsername: authData.user,
    title: data.title,
    authorId: 1,
    body: data.body,
    tags: data.tags.split(','),
    created: new Date(),
    edited: new Date(),
    imageUrl: data.imageUrl,
    published: true,
  });
  await getAllArticles();
};

export const handleDeleteUser = async (username: string) => {
  if (window.confirm('Delete user?')) {
    const authData = window.apiClient.getCurentUserData() as {
      user: string;
      token: string;
    };
    await window.apiClient.deleteUser({
      username,
      editorUsername: authData.user,
    });
    await getAllUsers();
  }
};

export const handleDeleteArticle = async (id: number) => {
  if (window.confirm('Delete article?')) {
    const authData = window.apiClient.getCurentUserData() as {
      user: string;
      token: string;
    };
    await window.apiClient.deleteArticle({
      id,
      editorUsername: authData.user,
    });
    await getAllArticles();
  }
};

export async function handleSearchInput(words: string[]) {
  const validKeywords = words.filter((word) => Boolean(word));
  const response = await window.apiClient.seacrhArticles({ keywords: validKeywords });
  useSearchStore.setState({
    ids: response.data.map((item: any) => item.id),
    keywords: validKeywords,
  });
}
