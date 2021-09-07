import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
  ) {}

  async signUp(authCredentials: AuthCredentialsDto) {
    const { username, password } = authCredentials;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const user = this.usersRepository.create({
        username,
        password: hashedPassword,
      });

      await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException('Username already exists!');
      }

      throw new InternalServerErrorException(
        'Oops! Something went wrong. Please contact the administrator...',
      );
    }
  }

  async signIn(authCredentials: AuthCredentialsDto) {
    const { username, password } = authCredentials;

    const user = await this.usersRepository.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      return 'success';
    } else {
      throw new UnauthorizedException('Please check your login credentials...');
    }
  }
}
