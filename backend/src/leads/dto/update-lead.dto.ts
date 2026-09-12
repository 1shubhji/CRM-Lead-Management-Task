import { IsEmail, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { LeadStatus, Priority } from '@prisma/client';

export class UpdateLeadDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{10}$/, { message: 'Phone Number must contain exactly 10 digits' })
  phone?: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  assignedEmployee?: string;

  @IsEnum(LeadStatus, { message: 'Invalid Lead Status' })
  @IsOptional()
  status?: LeadStatus;

  @IsEnum(Priority, { message: 'Invalid Lead Priority' })
  @IsOptional()
  priority?: Priority;
}
