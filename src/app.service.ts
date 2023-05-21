import { Injectable } from '@nestjs/common';
import fetch from "node-fetch";

function parseLinks(links: string): {} {
  const rows = links.split(/\r\n|\r|\n/g);
  const result = [];
  rows.map(row=> {
    const idIndex = row.indexOf("id=");
    const modelIndex = row.indexOf("model=");
    const modelEndIndex = row.indexOf("'>");
    const id = row.substring(idIndex + 3, modelIndex - 1);
    const name = row.substring(modelIndex + 6, modelEndIndex);
    result.push({ id, name });
  });
  return result.slice(1, 11);
}

@Injectable()
export class AppService {
  async getPartData({ part, input }): Promise<{}> {
    console.log(part, input);
    // parts: MotherBoards, Processors, VideoCards, RAMs, Drives
    const data = await fetch(`https://findhard.ru/checkcompatibility/GetAjaxSerp?parttype=${part}&input=${input}`);
    return parseLinks(await data.text());
  }

  async getCheck({ id1, part1, id2, part2 }) {
    // parts: MotherBoards, Processors, VideoCards, RAMs, Drives
    const data = await fetch(`https://findhard.ru/checkcompatibility/GetCompareResult?partType=${part1}&id=${id1}&compPartType=${part2}&compPartId=${id2}`);
    const dataText = await data.text();
    return dataText.includes('Совместимы');
  }
}
