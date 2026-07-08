import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController, WorkspacesListController } from './workspace.controller';

@Module({
  controllers: [WorkspaceController, WorkspacesListController],
  providers: [WorkspaceService],
})
export class WorkspaceModule {}
