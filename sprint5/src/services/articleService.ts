import articleRepository from "../repositories/articleRepository";

import appError from "../utils/appError";

import { ArticleCreateInput, ArticleItem, DisplayArticleItem, GetArticleListParams } from "../types/article";
class ArticleService {
  public async getArticleList(userId: string | undefined, params: GetArticleListParams): Promise<DisplayArticleItem[]> {
    const articles: ArticleItem[] = await articleRepository.getList(userId, params);

    const displayArticleList: DisplayArticleItem[] = articles.map((article) => {
      const isLiked = article.likedUser ? article.likedUser.length > 0 : false;
      return {
        id: article.id,
        title: article.title,
        content: article.content,
        createdAt: article.createdAt,
        isLiked
      }
    });
    return displayArticleList;
  }

  public async getArticle(userId: string | undefined, id: string): Promise<DisplayArticleItem> {
    const article: ArticleItem = await articleRepository.getById(userId, id);

    const isLiked = article.likedUser ? article.likedUser.length > 0 : false;
    const displayArticle = {
      id: article.id,
      title: article.title,
      content: article.content,
      createdAt: article.createdAt,
      isLiked
    };
    return displayArticle;
  }

  public async saveArticle(userId: string | undefined, input: ArticleCreateInput): Promise<DisplayArticleItem> {
    const article: ArticleItem = await articleRepository.createArticle(userId, input);

    const displayArticle = {
      id: article.id,
      title: article.title,
      content: article.content,
      createdAt: article.createdAt,
      isLiked: false
    };
    return displayArticle;
  }

  public async patchArticle(userId: string | undefined, id: string, input: Partial<ArticleCreateInput>): Promise<DisplayArticleItem> {
    const article: ArticleItem = await articleRepository.patchArticle(userId, id, input);
    if (!article) {
      throw new appError.NotFoundError("게시글이 존재하지 않습니다");
    }
    const isLiked = article.likedUser ? article.likedUser.length > 0 : false;
    const displayArticle = {
      id: article.id,
      title: article.title,
      content: article.content,
      createdAt: article.createdAt,
      isLiked
    };
    return displayArticle;
  }

  public async deleteArticle(userId: string | undefined, id: string): Promise<void> {
    await articleRepository.deleteArticle(userId, id);
  }

  public async isLiked(userId: string | undefined, id: string): Promise<boolean> {
    const article = await articleRepository.getById(userId, id);
    if (!article) {
      throw new appError.NotFoundError("게시글이 존재하지 않습니다");
    }
    return article.likedUser ? article.likedUser.length > 0 : false;
  }

  public async likeArticle(userId: string | undefined, id: string): Promise<void> {
    await articleRepository.like(id, {
      likedUser: {
        connect: { id: userId }
      }
    });
  }

  public async unlikeArticle(userId: string | undefined, id: string): Promise<void> {
    await articleRepository.unlike(id, {
      likedUser: {
        disconnect: { id: userId }
      }
    });
  }
}

const articleService = new ArticleService();
export default articleService;