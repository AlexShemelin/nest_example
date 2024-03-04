import { TopMenu } from '../components/TopMenu/TopMenu';
import { ArticleList } from '../components/ArticleList/ArticleList';
import { useUserStore, useArticleStore } from '../store/store';
import { FormBuilder } from '../components/FormBuilder/FormBuilder';
import { ModalWindow } from '../components/Modal/Modal';
import { createUserFields, createArticleFields } from '../types/form.types';
import {
  handleSubmitAddUser,
  handleSubmitAddArticle,
  getCurrentAuthState,
} from '../store/userActions';

export function Admin() {
  const users = useUserStore((state) => state.users);
  const articles = useArticleStore((state) => state.articles);
  const authState = getCurrentAuthState();
  if (authState.token === '') {
    return <h1>Restriced</h1>;
  }
  return (
    <div style={{ padding: '0 0 120px 0' }}>
      <TopMenu />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ textAlign: 'center' }}>Users</h2>
        <ArticleList data={users} />
        <ModalWindow
          modalName="Add user"
          buttonName="Add user"
          content={<FormBuilder array={createUserFields} onSubmit={handleSubmitAddUser} />}
        />
        <hr style={{ width: '100%' }} />
        <h2 style={{ textAlign: 'center' }}>Articles</h2>
        <ArticleList data={[...articles]} />
        <ModalWindow
          modalName="Add article"
          buttonName="Add article"
          content={<FormBuilder array={createArticleFields} onSubmit={handleSubmitAddArticle} />}
        />
      </div>
    </div>
  );
}
