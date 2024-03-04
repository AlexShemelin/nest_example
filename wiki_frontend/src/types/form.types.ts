import { useArticleStore, useUserStore } from '../store/store';

export const createUserFields = [
  { name: 'username', initialValue: '' },
  { name: 'password', initialValue: '' },
  { name: 'create/edit/delete', initialValue: 'true/true/true' },
];

export const editUserFields = (id: number) => {
  const desiredUser = useUserStore.getState().users.find((item) => item.id === id);

  let accessString = '';
  if (desiredUser?.access.create) {
    accessString += 'true/';
  } else {
    accessString += 'false/';
  }

  if (desiredUser?.access.edit) {
    accessString += 'true/';
  } else {
    accessString += 'false/';
  }

  if (desiredUser?.access.delete) {
    accessString += 'true';
  } else {
    accessString += 'false';
  }

  return [
    { name: 'username', initialValue: desiredUser?.username ?? '' },
    { name: 'create/edit/delete', initialValue: accessString },
  ];
};

export const createArticleFields = [
  { name: 'title', initialValue: '' },
  { name: 'tags', initialValue: '' },
  { name: 'body', initialValue: 'content' },
  { name: 'imageUrl', initialValue: '' },
];

export const editArticleFields = (id: number) => {
  const desiredArticle = useArticleStore.getState().articles.find((item) => item.id === id);
  return [
    { name: 'title', initialValue: desiredArticle?.title ?? '' },
    { name: 'tags', initialValue: desiredArticle?.tags.join(',') ?? '' },
    { name: 'body', initialValue: desiredArticle?.body ?? '' },
    { name: 'imageUrl', initialValue: desiredArticle?.imageUrl ?? '' },
  ];
};
