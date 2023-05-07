import { Body, Controller, Delete, Get, HttpException, Param, Post, Put } from '@nestjs/common';
import { Role } from './models/role.entity';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Get()
    async all(): Promise<Role[]> {
        return await this.roleService.findAll();
    }

    @Post()
    async create(
        @Body('name') name: string,
        @Body('permissions') permissionIds: number[],
    ): Promise<Role> {
        if (await this.roleService.findOne({ name })) {
            throw new HttpException('Role already exists', 400);
          }
        return await this.roleService.create({
            name,
            permissions: permissionIds.map(id => ({ id })),
        });
    }

    @Get(':id')
    async getOne(@Param('id') id: number): Promise<Role> {
        return await this.roleService.findOne({id}, ['permissions']);
    }

    @Put(':id')
    async update(
        @Param('id') id: number, 
        @Body('name') name: string,
        @Body('permissions') permissionIds: number[] = [], // Set default value to an empty array
    ): Promise<Role> {
        await this.roleService.update( id, { name } );
        const role = await this.roleService.findOne({id});
    
        // Check if permissionIds is an array
        if (!Array.isArray(permissionIds)) {
            throw new Error('Permission IDs must be an array');
        }
    
        return this.roleService.create({
            ...role,
            permissions: permissionIds.map(id => ({id}))
        });
    }
    
    

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.roleService.remove(id);
    }

}
