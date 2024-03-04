import { useLocation } from 'react-router-dom';
import { TopMenu } from '../components/TopMenu/TopMenu';
import { Article } from '../components/Article/Article';
import { useArticleStore, useUserStore } from '../store/store';

export function ArticlePage() {
  const location = useLocation();
  const id = location.search.split('id=')[1];
  const articles = useArticleStore((state) => state.articles);
  const desiredArticle = articles.find((entry) => entry.id === Number(id));
  const desiredAuthor = useUserStore((state) =>
    state.users.find((author) => author.id === desiredArticle?.authorId)
  );
  return (
    <>
      <TopMenu />
      <Article author={desiredAuthor?.username} data={desiredArticle} />
    </>
  );
}
