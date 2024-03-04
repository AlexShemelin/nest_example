import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { LoginUserDto } from '../types/common.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.userService.login(
      loginUserDto.username,
      loginUserDto.password,
    );
  }

  @Get(':username')
  async check(@Param() params: { username: string }) {
    return await this.userService.checkUsernameAvailability(params.username);
  }
}
