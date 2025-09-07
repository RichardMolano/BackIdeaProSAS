import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Dependence } from "../../entities/dependence.entity";
import { DependenceController } from "./dependence.controller";
import { DependenceService } from "./dependence.service";

@Module({
  imports: [TypeOrmModule.forFeature([Dependence])],
  controllers: [DependenceController],
  providers: [DependenceService],
})
export class DependenceModule {}
