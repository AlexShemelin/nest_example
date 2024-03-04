import { TopMenu } from '../components/TopMenu/TopMenu';
import { ArticlePreview } from '../components/ArticlePreview/ArticlePreview';
import { useArticleStore, useSearchStore } from '../store/store';
import { IArticle } from '../types/core.types';

export function HomePage() {
  const articles = useArticleStore((state) => state.articles);
  const searchedStore = useSearchStore((state) => state);
  let articlesFormated: (Pick<IArticle, 'title' | 'imageUrl' | 'id'> & {
    date: string;
    tags: string;
  })[];

  if (searchedStore.keywords.length !== 0) {
    articlesFormated = articles
      .filter((article) => searchedStore.ids.includes(article.id))
      .map((article) => ({
        date: String(article.edited).split('T')[0],
        title: article.title,
        imageUrl: article.imageUrl,
        tags: article.tags.join(','),
        id: article.id,
      }));
  } else {
    articlesFormated = articles.map((article) => ({
      date: String(article.edited).split('T')[0],
      title: article.title,
      imageUrl: article.imageUrl,
      tags: article.tags.join(','),
      id: article.id,
    }));
  }

  return (
    <>
      <TopMenu />
      <h1 style={{ textAlign: 'center' }}>All articles</h1>
      <ArticlePreview props={articlesFormated} />
    </>
  );
}
