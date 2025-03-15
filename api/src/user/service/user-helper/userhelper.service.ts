import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { CreateUserDto } from 'src/user/models/dto/create-user.dto';
import { LoginUserDto } from 'src/user/models/dto/login-user.dto';
import { UserInterface } from 'src/user/models/user.interface';

@Injectable()
export class UserHelperService {
  createUserDtoToEntity(
    createUserDto: CreateUserDto,
  ): Observable<UserInterface> {
    return of({
      email: createUserDto.email,
      username: createUserDto.username,
      password: createUserDto.password,
    });
  }

  loginUserDtoToEntity(loginUserDto: LoginUserDto): Observable<UserInterface> {
    return of({
      email: loginUserDto.email,
      password: loginUserDto.password,
    });
  }
}
