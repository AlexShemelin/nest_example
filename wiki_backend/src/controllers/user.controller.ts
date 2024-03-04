import { Controller, Get, Put, Post, Body, Param } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto, EditUserDto, DeleteUserDto } from '../types/common.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Put()
  async edit(@Body() editUserDto: EditUserDto) {
    return await this.userService.edit(editUserDto);
  }

  @Post('delete')
  async delete(@Body() editUserDto: DeleteUserDto) {
    return await this.userService.delete(editUserDto);
  }

  @Get(':id')
  async getById(@Param() params: { id: number }) {
    return await this.userService.getOneById(params.id);
  }

  @Get(':name')
  async getByName(@Param() params: { name: string }) {
    return await this.userService.getOneByName(params.name);
  }

  @Get()
  async getAll() {
    return await this.userService.getAll();
  }
}
