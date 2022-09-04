import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService){}
    @UseGuards(JwtGuard)
    @Get('me')
    getMe(
        @GetUser() user: User
    ){
        return user;
    }

    @Patch()
    editUser(
        @GetUser('id') userId: number, 
        @Body() dto: EditUserDto,
        ) {
            return this.userService.editUser(userId, dto);
        }
    


}
