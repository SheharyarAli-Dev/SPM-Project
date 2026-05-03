import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { FundWalletDto } from './dto/fund-wallet.dto';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) { }

  @Get('user/:userId')
  @UseGuards(OwnershipGuard)
  findByUser(
    @Param('userId') userId: string,
    @Query('role') role: string,
    @Headers('x-user-id') requestingUserId: string,
    @Headers('x-user-role') headerRole: string,
  ) {
    const userRole = (role || headerRole || '').toLowerCase();
    if (userRole && !['client', 'freelancer', 'admin'].includes(userRole)) {
      throw new BadRequestException(
        `Invalid role "${userRole}". Must be client, freelancer, or admin.`,
      );
    }
    return this.walletsService.findByUser(+userId, +requestingUserId, userRole || undefined);
  }

  @Post('fund')
  @UseGuards(OwnershipGuard)
  fund(
    @Body() body: FundWalletDto,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') headerRole: string,
  ) {
    const role = (body.role || headerRole || '').toLowerCase();
    return this.walletsService.fund(body.user_id, body.amount, +userId, role || undefined);
  }
}
