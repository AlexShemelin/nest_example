import { SimpleGrid, Card, Image, Text, Container, AspectRatio } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import classes from './ArticlePreview.module.css';

interface IArticlePreview {
  date: string;
  title: string;
  imageUrl: string;
  tags: string;
  id: number;
}

export function ArticlePreview({ props }: { props: IArticlePreview[] }) {
  const navigate = useNavigate();
  return (
    <Container py="xl">
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        {props.map((item) => (
          <Card
            key={item.title}
            p="md"
            radius="md"
            component="a"
            href="#"
            className={classes.card}
            onClick={() => {
              navigate(`/article?id=${item.id}`);
            }}
          >
            <AspectRatio ratio={1920 / 1080}>
              <Image src={item.imageUrl} />
            </AspectRatio>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
              {item.date}
            </Text>
            <Text c="blue" size="xs" tt="uppercase" fw={300} mt="xs">
              {item.tags}
            </Text>
            <Text className={classes.title} mt={5}>
              {item.title}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}
