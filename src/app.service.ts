import { Injectable } from '@nestjs/common';
const { Sequelize } = require('sequelize');
import fetch from "node-fetch";
import { DataTypes } from "sequelize";

const sequelize = new Sequelize('ppdb', 'postgres', '123', {
  host: 'localhost',
  dialect: 'postgres'
});

const Ppdb = sequelize.define('Ppdb', {
  motherBoard: {
    type: DataTypes.STRING
  },
  processor: {
    type: DataTypes.STRING
  },
  videoCard: {
    type: DataTypes.STRING
  },
  ram: {
    type: DataTypes.STRING
  },
  drive: {
    type: DataTypes.STRING
  },
  motherBoardId: {
    type: DataTypes.STRING
  },
  processorId: {
    type: DataTypes.STRING
  },
  videoCardId: {
    type: DataTypes.STRING
  },
  ramId: {
    type: DataTypes.STRING
  },
  driveId: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING
  },
  likes: {
    type: DataTypes.NUMBER
  },
  type: {
    type: DataTypes.STRING
  },
}, {
});

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

  async save(body) {
    const sborka = await Ppdb.create(body);

    return body;
  }

  async getSaves() {
    const saves = await Ppdb.findAll();

    return saves;
  }

  async like(body) {
    const { id } = body;
    await Ppdb.increment({ likes: 1 }, { where: { id } });
  }
}
