import { Controller, Get, Req } from "@nestjs/common";
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getPartData(@Req() request): any {
    const { part, input } = request.query;
    return this.appService.getPartData({ part, input });
  }

  @Get('check')
  getCheck(@Req() request): any {
    const { id1, part1, id2, part2 } = request.query;
    return this.appService.getCheck({ id1, part1, id2, part2 });
  }
}
