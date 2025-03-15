import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  from,
  map,
  mapTo,
  mergeMap,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { UserEntity } from 'src/user/models/User.entity';
import { UserInterface } from 'src/user/models/user.interface';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  create(newUser: UserInterface): Observable<UserInterface> {
    return this.mailExists(newUser.email).pipe(
      mergeMap((exists) => {
        if (exists) {
          return throwError(
            () =>
              new HttpException('Email is already in use', HttpStatus.CONFLICT),
          );
        }

        return this.hashPassword(newUser.password ?? '').pipe(
          mergeMap((passwordHash) => {
            newUser.password = passwordHash;
            return from(this.userRepository.save(newUser));
          }),
          mergeMap((user) => this.findOne(user.id!)),
        );
      }),
    );
  }

  findAll(options: IPaginationOptions): Observable<Pagination<UserInterface>> {
    return from(paginate<UserEntity>(this.userRepository, options));
  }

  login(user: UserInterface): Observable<string> {
    return this.findByEmail(user.email).pipe(
      mergeMap((foundUser: UserInterface) => {
        if (!foundUser) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        return this.validatePassword(user.password!, foundUser.password!).pipe(
          mergeMap((matches: boolean) => {
            if (!matches) {
              throw new HttpException(
                'Invalid credentials',
                HttpStatus.UNAUTHORIZED,
              );
            }

            return this.findOne(foundUser.id!).pipe(
              mergeMap((user) => this.authService.generateJwt(user)),
            );
          }),
        );
      }),
    );
  }

  findByEmail(email: string): Observable<UserInterface> {
    return from(
      this.userRepository.findOne({
        where: { email },
        select: ['id', 'email', 'password'],
      }),
    ).pipe(
      map((user) => {
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return user;
      }),
    );
  }

  private hashPassword(password: string): Observable<string> {
    return this.authService.hashPassword(password);
  }

  private validatePassword(
    password: string,
    storedPasswordHash: string,
  ): Observable<boolean> {
    return this.authService.comparePassword(password, storedPasswordHash);
  }

  private findOne(id: number): Observable<UserInterface> {
    return from(this.userRepository.findOne({ where: { id } })).pipe(
      switchMap((user) =>
        user
          ? of(user as UserInterface)
          : throwError(() => new Error('User not found')),
      ),
    );
  }

  private mailExists(email: string): Observable<boolean> {
    return from(this.userRepository.findOne({ where: { email } })).pipe(
      map(Boolean),
    );
  }
}
