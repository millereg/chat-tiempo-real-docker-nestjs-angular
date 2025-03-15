/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { defer, Observable } from 'rxjs';
import * as bcryptjs from 'bcryptjs';
import { UserInterface } from 'src/user/models/user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJwt(user: UserInterface): Observable<string> {
    return defer(() => this.jwtService.signAsync({ user }));
  }

  hashPassword(password: string): Observable<string> {
    return defer(() => bcryptjs.hash(password, 12));
  }

  comparePassword(
    password: string,
    storedPasswordHash: string,
  ): Observable<any> {
    return defer(() => bcryptjs.compare(password, storedPasswordHash));
  }
}
