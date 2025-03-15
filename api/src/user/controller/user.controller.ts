import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user-service/user.service';
import { map, Observable, of, switchMap } from 'rxjs';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { UserHelperService } from '../service/user-helper/userhelper.service';
import { UserInterface } from '../models/user.interface';
import { Pagination } from 'nestjs-typeorm-paginate';
import { LoginUserDto } from '../models/dto/login-user.dto';
import { LoginResponseInterface } from '../models/login-response.interface';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private userHelperService: UserHelperService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Observable<UserInterface> {
    return this.userHelperService
      .createUserDtoToEntity(createUserDto)
      .pipe(switchMap((user) => this.userService.create(user)));
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Observable<Pagination<UserInterface>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.findAll({
      page,
      limit,
      route: 'http://localhost:3000/api/users',
    });
  }

  @Post('login')
  login(
    @Body() loginUserDto: LoginUserDto,
  ): Observable<LoginResponseInterface> {
    return this.userHelperService.loginUserDtoToEntity(loginUserDto).pipe(
      switchMap((user: UserInterface) =>
        this.userService.login(user).pipe(
          map((jwt: string) => ({
            access_token: jwt,
            token_type: 'JWT',
            expires_in: 10000,
          })),
        ),
      ),
    );
  }
}
