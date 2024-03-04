import axios, { AxiosResponse } from 'axios';
import {
  CreateUserDto,
  CreateArticleDto,
  DeleteArticleDto,
  DeleteUserDto,
  EditArticleDto,
  EditUserDto,
  LoginUserDto,
  SearchArticleDto,
} from '../types/common';
import { getCookie, setCookie } from '../utils/cookie';

export class ApiClient {
  private baseUrl: string;
  protected readonly cookieToken = 'mainToken';
  protected readonly cookieUsername = 'mainUserName';
  protected selectedItemName = '';
  protected token = '';
  protected username = '';

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    const token = getCookie(this.cookieToken);
    if (token) {
      this.token = token;
    }
    const username = getCookie(this.cookieUsername);
    if (username) {
      this.username = username;
    }
  }

  public async loginUser(dto: LoginUserDto) {
    const { data } = await axios.post(`${this.baseUrl}/auth`, dto);
    this.token = data.message;
    this.username = dto.username;
    setCookie(this.cookieToken, this.token, 1000);
    setCookie(this.cookieUsername, this.username, 1000);
    return data;
  }

  public async logout() {
    this.token = '';
    this.username = '';
    setCookie(this.cookieToken, this.token, 1000);
    setCookie(this.cookieUsername, this.username, 1000);
  }

  public getCurentUserData() {
    return {
      user: this.username,
      token: this.token,
    };
  }

  public async getAllUsers() {
    const { data } = await axios.get(`${this.baseUrl}/user`);
    return data;
  }

  public async getAllArticles() {
    const { data } = await axios.get(`${this.baseUrl}/article`);
    return data;
  }

  public async createUser(dto: CreateUserDto): Promise<AxiosResponse> {
    return axios.post(`${this.baseUrl}/user`, dto, {
      headers: {
        Authorization: this.token,
      },
    });
  }

  public async editUser(dto: EditUserDto): Promise<AxiosResponse> {
    return axios.put(`${this.baseUrl}/user`, dto, {
      headers: {
        Authorization: this.token,
      },
    });
  }

  public async deleteUser(dto: DeleteUserDto): Promise<AxiosResponse> {
    return axios.post(`${this.baseUrl}/user/delete`, dto, {
      headers: {
        Authorization: this.token,
      },
    });
  }

  public async createArticle(dto: CreateArticleDto): Promise<AxiosResponse> {
    const response = await axios.post(`${this.baseUrl}/article`, dto, {
      headers: {
        Authorization: this.token,
      },
    });
    return response;
  }

  public async editArticle(dto: EditArticleDto): Promise<AxiosResponse> {
    const response = axios.put(`${this.baseUrl}/article`, dto, {
      headers: {
        Authorization: this.token,
      },
    });
    return response;
  }

  public async deleteArticle(dto: DeleteArticleDto): Promise<AxiosResponse> {
    return axios.post(`${this.baseUrl}/article/delete`, dto, {
      headers: {
        Authorization: this.token,
      },
    });
  }

  public async seacrhArticles(dto: SearchArticleDto): Promise<AxiosResponse> {
    return axios.post(`${this.baseUrl}/article/search`, dto, {
      headers: {
        Authorization: this.token,
      },
    });
  }
}
