import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { PqrModule } from "./modules/pqr/pqr.module";
import { ChatModule } from "./modules/chat/chat.module";
import { AssignmentsModule } from "./modules/assignments/assignments.module";
import { HealthModule } from "./modules/health/health.module";
import { SeederModule } from "./modules/seeder/seeder.module";

import { Role } from "./entities/role.entity";
import { User } from "./entities/user.entity";
import { PqrTicket } from "./entities/pqr-ticket.entity";
import { ChatGroup } from "./entities/chat-group.entity";
import { Message } from "./entities/message.entity";
import { Assignment } from "./entities/assignment.entity";
import { Dependence } from "entities/dependence.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService) => {
        const url = cfg.get<string>("DATABASE_URL");
        const isSupabase = url?.includes("supabase.com") ?? false;
        return {
          type: "postgres",
          url,
          ssl: isSupabase ? { rejectUnauthorized: false } : false,
          autoLoadEntities: true,
          synchronize: true, // for dev. In prod, use migrations
          entities: [
            Role,
            User,
            PqrTicket,
            ChatGroup,
            Message,
            Assignment,
            Dependence,
          ],
        };
      },
    }),
    AuthModule,
    UsersModule,
    PqrModule,
    ChatModule,
    AssignmentsModule,
    HealthModule,
    SeederModule,
  ],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    // eslint-disable-next-line no-console
    console.log("[OK] AppModule initialized");
  }
}
