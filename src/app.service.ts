import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  findProc(input): any {
    const data = this.httpService.get(`https://findhard.ru/checkcompatibility/GetAjaxSerp?parttype=Processors&input=${input}`);
    return data;
  }
}
