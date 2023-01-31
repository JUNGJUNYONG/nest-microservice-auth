import { Injectable } from '@nestjs/common';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly jwtService: JwtService,
  ) {}
  public async login(user) {
    const [accessToken, refreshToken] = await this.generateTokens(user);

    return {
      user,
      accessToken,
    };
  }

  private async generateTokens(user: any) {
    const jwtid = uuidv4();

    const accessToken = await this.jwtService.signAsync(
      {
        displayName: user.displayName,
        id: user.id,
      },
      {
        issuer: 'PoProstuWitold',
        secret: 'ghegfahasfdawfa',
        expiresIn: '5m',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        displayName: user.displayName,
        id: user.id,
      },
      {
        jwtid,
        issuer: 'PoProstuWitold',
        secret: 'dwafagadfasdaw',
        expiresIn: '30d',
      },
    );

    await this.redis.set(
      `refresh-token:${user.id}:${jwtid}`,
      user.id,
      'EX',
      60 * 60 * 24 * 30,
    );

    return [accessToken, refreshToken];
  }
}
