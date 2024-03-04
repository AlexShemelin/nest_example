import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from '../services/article.service';
import { InMemoryDB } from '../services/common/database.service';
import { ArticelController } from '../controllers/article.contoller';
import 'dotenv/config';

describe('Auth test', () => {
  let articleController: ArticelController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ArticelController],
      providers: [
        ArticleService,
        {
          provide: 'DatabaseAbstract',
          useClass: InMemoryDB,
        },
      ],
    }).compile();
    articleController = app.get<ArticelController>(ArticelController);
  });

  describe('article crud', () => {
    it('should add article', async () => {
      await articleController.create({
        editorUsername: 'admin',
        authorId: 1,
        body: 'Hello',
        created: new Date(),
        edited: new Date(),
        tags: ['PC', 'Computers'],
        title: 'PC Bestbuy',
        published: true,
        imageUrl: '',
      });
      const allArticles = await articleController.getAll();
      expect(allArticles[0].title).toBe('PC Bestbuy');
    });
    it('should edit article', async () => {
      await articleController.create({
        editorUsername: 'admin',
        authorId: 1,
        body: 'Hello',
        created: new Date(),
        edited: new Date(),
        tags: ['PC', 'Computers'],
        title: 'PC Bestbuy',
        published: true,
        imageUrl: '',
      });
      await articleController.edit({
        editorUsername: 'admin',
        id: 1,
        authorId: 1,
        body: 'Hello',
        created: new Date(),
        edited: new Date(),
        tags: ['PC', 'Computers'],
        title: 'PC Bestbuy New',
        published: true,
        imageUrl: '',
      });
      const allArticles = await articleController.getAll();
      expect(allArticles[0].title).toBe('PC Bestbuy New');
    });
    it('should delete article', async () => {
      await articleController.create({
        editorUsername: 'admin',
        authorId: 1,
        body: 'Hello',
        created: new Date(),
        edited: new Date(),
        tags: ['PC', 'Computers'],
        title: 'PC Bestbuy',
        published: true,
        imageUrl: '',
      });
      await articleController.delete({
        id: 1,
        editorUsername: 'admin',
      });
      const allArticles = await articleController.getAll();
      expect(allArticles.length).toBe(0);
    });
    it('should NOT delete article', async () => {
      await articleController.create({
        editorUsername: 'admin',
        authorId: 1,
        body: 'Hello',
        created: new Date(),
        edited: new Date(),
        tags: ['PC', 'Computers'],
        title: 'PC Bestbuy',
        published: true,
        imageUrl: '',
      });
      await articleController.delete({
        id: 123,
        editorUsername: 'admin',
      });
      const allArticles = await articleController.getAll();
      expect(allArticles.length).toBe(1);
    });
  });
});
