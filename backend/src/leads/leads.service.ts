import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { QueryLeadsDto } from './dto/query-lead.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLeadDto: CreateLeadDto) {
    // 1. Check duplicate phone number
    const existingPhone = await this.prisma.lead.findUnique({
      where: { phone: createLeadDto.phone },
    });
    if (existingPhone) {
      throw new ConflictException('Phone number is already registered to another lead');
    }

    // 2. Check duplicate email
    const existingEmail = await this.prisma.lead.findUnique({
      where: { email: createLeadDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email address is already registered to another lead');
    }

    try {
      return await this.prisma.lead.create({
        data: {
          name: createLeadDto.name,
          company: createLeadDto.company || null,
          phone: createLeadDto.phone,
          email: createLeadDto.email,
          city: createLeadDto.city || null,
          source: createLeadDto.source || null,
          assignedEmployee: createLeadDto.assignedEmployee || null,
          status: createLeadDto.status || 'New',
          priority: createLeadDto.priority || 'Medium',
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const target = (error.meta?.target as string[]) || [];
        if (target.includes('phone_number')) {
          throw new ConflictException('Phone number is already registered to another lead');
        }
        if (target.includes('email_address')) {
          throw new ConflictException('Email address is already registered to another lead');
        }
      }
      throw error;
    }
  }

  async findAll(query: QueryLeadsDto) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    const skip = (page - 1) * limit;

    const where: Prisma.LeadWhereInput = {};

    // 1. Searching: supports search by Name, Company Name, Phone, and Email
    if (query.search) {
      const searchPattern = query.search.trim();
      where.OR = [
        { name: { contains: searchPattern, mode: 'insensitive' } },
        { company: { contains: searchPattern, mode: 'insensitive' } },
        { phone: { contains: searchPattern } },
        { email: { contains: searchPattern, mode: 'insensitive' } },
      ];
    }

    // 2. Filtering: Status, Priority, Assigned Employee
    if (query.status) {
      where.status = query.status;
    }
    if (query.priority) {
      where.priority = query.priority;
    }
    if (query.assignedEmployee) {
      where.assignedEmployee = {
        contains: query.assignedEmployee.trim(),
        mode: 'insensitive',
      };
    }

    // 3. Sorting: Default Created Date (Newest First = desc)
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';
    const orderBy: Prisma.LeadOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // Execute query and get count in parallel
    const [total, data] = await Promise.all([
      this.prisma.lead.count({ where }),
      this.prisma.lead.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findOne(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
    });
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto) {
    // Check if the lead exists
    const lead = await this.findOne(id);

    // If phone is updated, check duplicates
    if (updateLeadDto.phone && updateLeadDto.phone !== lead.phone) {
      const existingPhone = await this.prisma.lead.findUnique({
        where: { phone: updateLeadDto.phone },
      });
      if (existingPhone) {
        throw new ConflictException('Phone number is already registered to another lead');
      }
    }

    // If email is updated, check duplicates
    if (updateLeadDto.email && updateLeadDto.email !== lead.email) {
      const existingEmail = await this.prisma.lead.findUnique({
        where: { email: updateLeadDto.email },
      });
      if (existingEmail) {
        throw new ConflictException('Email address is already registered to another lead');
      }
    }

    try {
      return await this.prisma.lead.update({
        where: { id },
        data: updateLeadDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const target = (error.meta?.target as string[]) || [];
        if (target.includes('phone_number')) {
          throw new ConflictException('Phone number is already registered to another lead');
        }
        if (target.includes('email_address')) {
          throw new ConflictException('Email address is already registered to another lead');
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.lead.delete({
      where: { id },
    });
    return { success: true, message: 'Lead successfully deleted' };
  }
}
