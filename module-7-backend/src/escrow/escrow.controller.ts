import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Headers,
  Query,
} from '@nestjs/common';
import { EscrowService } from './escrow.service';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { CreateEscrowDto } from './dto/create-escrow.dto';
import { FundEscrowDto } from './dto/fund-escrow.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('escrow')
export class EscrowController {
  constructor(private readonly escrowService: EscrowService) { }

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.escrowService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.escrowService.findOne(+id);
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.escrowService.findByProject(+projectId);
  }

  @Post()
  @UseGuards(OwnershipGuard)
  create(@Body() body: CreateEscrowDto) {
    return this.escrowService.create(body);
  }

  @Post(':id/fund')
  @UseGuards(OwnershipGuard)
  fund(
    @Param('id') id: string,
    @Body() body: FundEscrowDto,
    @Headers('x-user-id') userId: string,
  ) {
    return this.escrowService.fund(+id, body.amount, +userId);
  }

  @Post(':id/freeze')
  @UseGuards(OwnershipGuard)
  freeze(@Param('id') id: string, @Headers('x-user-id') userId: string) {
    return this.escrowService.freeze(+id, +userId);
  }

  @Post(':id/close')
  @UseGuards(OwnershipGuard)
  close(@Param('id') id: string, @Headers('x-user-id') userId: string) {
    return this.escrowService.close(+id, +userId);
  }
}
