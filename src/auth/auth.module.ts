import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { OptionalStrategy } from './strategies/optional.strategy';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  imports: [UsersModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, OptionalStrategy, PermissionsGuard],
  exports: [AuthService],
})
export class AuthModule { }
