import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { UserRepository } from '../user/repositories/user.repository';
import { ConfigService } from '@nestjs/config';
import { scryptSync } from 'crypto';
import { LogInDto } from './dto/log-in.dto';
import { RoleService } from '../role/role.service';
import { RoleEnum } from '../role/enums/role.enum';
import { ActionRepository } from '../action/repositories/action.repository';
import { ActionTypeEnum } from '../action/entities/action.entity';
import { EmailService } from '../../infrastructure/mailer/email.service';
import { showUserDto, ShowUserDto } from '../user/dto/show-ser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly roleService: RoleService,
    private readonly actionRepository: ActionRepository,
    private readonly emailService: EmailService,
  ) {}
  async signIn(
    session: Record<string, any>,
    data: SignInDto,
  ): Promise<ShowUserDto> {
    const hashPassword = this.hashPassword(data.password);

    const userRole = await this.roleService.findOne({
      where: { name: RoleEnum.User },
      relations: ['permissions'],
    });

    const user = await this.userRepository.create({
      ...data,
      password: hashPassword,
      role: userRole,
    });

    const action = await this.actionRepository.create({
      type: ActionTypeEnum.emailCofirmation,
      user,
    });

    await this.emailService.send({
      type: ActionTypeEnum.emailCofirmation,
      mailTo: user.email,
      data: {
        actionId: action.id,
        name: user.name,
      },
    });

    session.user = { id: user.id };
    return showUserDto(user);
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
  ): Promise<ShowUserDto> {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
      relations: ['role', 'role.permissions'],
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

    return showUserDto(user);
  }

  async checkPassword(password: string, hash: string): Promise<boolean> {
    const hashPassword = this.hashPassword(password);

    return hashPassword === hash;
  }

  async logout(session: Record<string, any>) {
    return session.destroy();
  }

  async confirmEmail(actionId) {
    const action = await this.actionRepository.findOne({
      where: { id: actionId },
      relations: ['user'],
    });

    if (!action) {
      throw new BadRequestException('EMAIL_CONFIRMATION_ERROR');
    }

    action.user.confirmEmail();

    await this.userRepository.save(action.user);
    await this.actionRepository.delete(actionId);
  }
}
