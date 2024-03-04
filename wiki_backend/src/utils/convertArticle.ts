import { IArticle } from '../types/core.types';
import { Article } from '@prisma/client';

// Function to convert Prisma Article model to IArticle
export function prismaToArticle(prismaArticle: Article): IArticle {
  return {
    id: prismaArticle.id,
    title: prismaArticle.title,
    tags: prismaArticle.tags,
    body: prismaArticle.body,
    edited: new Date(prismaArticle.edited),
    created: new Date(prismaArticle.created),
    authorId: prismaArticle.authorId,
    published: prismaArticle.published ?? true, // Default to true if not provided
    imageUrl: prismaArticle.imageUrl,
  };
}

// Function to convert IArticle to Prisma Article model
export function articleToPrisma(article: IArticle): Article {
  return {
    id: article.id,
    title: article.title,
    tags: article.tags,
    body: article.body,
    edited: article.edited.toISOString(),
    created: article.created.toISOString(),
    authorId: article.authorId,
    published: article.published,
    imageUrl: article.imageUrl,
  };
}
