// backend/src/users/users.controller.ts - Debug version with better logging
import { 
  Controller, 
  Get, 
  Put, 
  Delete, 
  Body, 
  UseGuards, 
  Request, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { 
  UpdateUserDto, 
  UpdatePasswordDto, 
  UpdateProfilePictureDto, 
  DeleteAccountDto 
} from './dto/user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers(@Request() req) {
    console.log('Getting all users, requested by:', req.user.email);
    return this.usersService.getAllUsers();
  }

  @Get('me')
  getCurrentUser(@Request() req) {
    console.log('Getting current user:', req.user.userId);
    return this.usersService.getCurrentUser(req.user.userId);
  }

  @Get('me/stats')
  getUserStats(@Request() req) {
    console.log('Getting user stats:', req.user.userId);
    return this.usersService.getUserStats(req.user.userId);
  }

  @Put('me/profile')
  updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    console.log('Updating profile for user:', req.user.userId, 'with data:', updateUserDto);
    return this.usersService.updateProfile(req.user.userId, updateUserDto);
  }

  @Put('me/password')
  @HttpCode(HttpStatus.OK)
  updatePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
    console.log('Updating password for user:', req.user.userId);
    return this.usersService.updatePassword(req.user.userId, updatePasswordDto);
  }

  @Put('me/avatar')
  updateAvatar(@Request() req, @Body() updateAvatarDto: UpdateProfilePictureDto) {
    console.log('🎭 Avatar update request received:', {
      userId: req.user.userId,
      hasAvatar: !!updateAvatarDto.avatar,
      avatarLength: updateAvatarDto.avatar?.length || 0,
      bodyKeys: Object.keys(updateAvatarDto),
      bodyType: typeof updateAvatarDto.avatar
    });
    
    try {
      return this.usersService.updateAvatar(req.user.userId, updateAvatarDto);
    } catch (error) {
      console.error('❌ Avatar update error in controller:', error);
      throw error;
    }
  }

  @Delete('me/avatar')
  removeAvatar(@Request() req) {
    console.log('Removing avatar for user:', req.user.userId);
    return this.usersService.removeAvatar(req.user.userId);
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  deleteAccount(@Request() req, @Body() deleteAccountDto: DeleteAccountDto) {
    console.log('Deleting account for user:', req.user.userId);
    return this.usersService.deleteAccount(req.user.userId, deleteAccountDto.password);
  }
}