import { Text, Title, Image } from '@mantine/core';
import { Link } from 'react-router-dom';
import classes from './Article.module.css';
import { IArticle } from '../../types/core.types';

export function Article({
  data,
  author,
}: {
  data: IArticle | undefined;
  author: string | undefined;
}) {
  if (!data || !author) {
    return <h1 style={{ textAlign: 'center' }}>Not found</h1>;
  }
  return (
    <div className={classes.wrapper}>
      <div className={classes.body}>
        <Link to="/">Back</Link>
        <Title className={classes.title}>{data.title}</Title>
        <Text c="blue" fw={500} fz="lg" mb={5}>
          Author: {author} <br /> Edited: {String(data.edited).split('T')[0]} <br /> Tags:{' '}
          {data.tags.map((tag) => (
            <span key={tag}>{tag}; </span>
          ))}
        </Text>
        <Text
          style={{ textAlign: 'justify' }}
          size="lg"
          fz="lg"
          c="white"
          dangerouslySetInnerHTML={{ __html: data.body }}
        />
      </div>
      <Image src={data.imageUrl} className={classes.image} />
    </div>
  );
}
