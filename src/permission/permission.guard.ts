import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Reflector} from "@nestjs/core";
import {AuthService} from "../auth/auth.service";
import {RoleService} from "../role/role.service";
import {User} from "../user/models/user.entity";
import { UsersService } from 'src/user/user.service';
import { Role } from 'src/role/models/role.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private relfector: Reflector,
        private authService: AuthService,
        private userService: UsersService,
        private roleService: RoleService
    ) {
    }

    async canActivate(context: ExecutionContext) {
      // Extract 'access' metadata set by a custom decorator (e.g., HasPermission)
      const access = this.relfector.get<string>('access', context.getHandler());
      
      // If there's no 'access' metadata, return true (allowing the request to proceed)
      if (!access) {
          return true;
      }
  
      // Retrieve the user's ID from the request
      const request = context.switchToHttp().getRequest();
      const id = await this.authService.userId(request);
      console.log('User ID:', id);
  
      // Fetch the user's information, including the user's role
      const user: User = await this.userService.findOne({id}, ['role']);
      console.log('User object:', user);
  
      // Fetch the role information, including its associated permissions
      const role: Role = await this.roleService.findOne({id: user.role.id}, ['permissions']);

  
      // If the request method is 'GET', check if the user's role has a 'view' or 'edit' permission
      // for the required 'access'. If true, return true (allowing the request to proceed)
      if (request.method === 'GET') {
          return role.permissions.some(p => (p.name === `view_${access}`) || (p.name === `edit_${access}`));
      }
  
      // For other request methods, check if the user's role has an 'edit' permission
      // for the required 'access'. If true, return true (allowing the request to proceed)
      return role.permissions.some(p => p.name === `edit_${access}`);
  }
  
}