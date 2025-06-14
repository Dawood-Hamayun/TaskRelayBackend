import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { MembersModule } from './members/members.module';
import { CommentsModule } from './comments/comments.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { TagsModule } from './tags/tags.module';
import { MeetingsModule } from './meetings/meetings.module';
import { InvitesModule } from './invites/invites.module';
import { SubtasksService } from './subtasks/subtasks.service';
import { SubtasksController } from './subtasks/subtasks.controller';
import { SubtasksModule } from './subtasks/subtasks.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, TasksModule, ProjectsModule, MembersModule, CommentsModule, AttachmentsModule, TagsModule, MeetingsModule, InvitesModule, SubtasksModule],
  providers: [SubtasksService],
  controllers: [SubtasksController],
})
export class AppModule {}