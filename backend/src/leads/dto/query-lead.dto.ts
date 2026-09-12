import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LeadStatus, Priority } from '@prisma/client';

export class QueryLeadsDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsString()
  @IsOptional()
  assignedEmployee?: string;

  @IsString()
  @IsOptional()
  sortBy?: string; // 'createdAt'

  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc'; // 'asc' for oldest first, 'desc' for newest first

  @IsString()
  @IsOptional()
  page?: string;

  @IsString()
  @IsOptional()
  limit?: string;
}
