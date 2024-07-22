import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { User } from '../user/entities/user.entity';
import { UserRepository } from '../user/repositories/user.repository';
import { ConfigService } from '@nestjs/config';
import { scryptSync } from 'crypto';
import { LogInDto } from './dto/log-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}
  async signIn(
    session: Record<string, any>,
    data: SignInDto,
  ): Promise<{ user: User }> {
    const hashPassword = this.hashPassword(data.password);

    const user = await this.userRepository.create({
      ...data,
      password: hashPassword,
    });

    session.user = { id: user.id };
    return { user };
  }

  hashPassword(password: string): string {
    const { salt, hashLength } = this.configService.get(
      'app.passwordHashParams',
    );

    const hash = scryptSync(password, salt, hashLength);

    return hash.toString('hex');
  }

  async login(
    session: Record<string, any>,
    data: LogInDto,
  ): Promise<{ user: User } | string> {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const passwordIsValid = await this.checkPassword(
      data.password,
      user.password,
    );

    if (!passwordIsValid) {
      throw new BadRequestException('Password is not correct');
    }

    session.user = { id: user.id };

    return { user };
  }

  async checkPassword(password: string, hash: string): Promise<boolean> {
    const hashPassword = this.hashPassword(password);

    return hashPassword === hash;
  }

  async logout(session: Record<string, any>) {
    return session.destroy();
  }
}
