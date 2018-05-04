import { parse } from 'url';

const accDataSource = [];

for (let i = 1; i < 46; i += 1) {
  accDataSource.push({
    id: i,
    stationid: 1,
    machineid: Math.floor(Math.random() * 3) + 1,
    companyCode: 'nbl',
    companyName: '拿不老',
    index: Math.floor(Math.random() * 13) + 1,
    deadband: Math.floor(Math.random() * 999.99 * 100) / 100,
    value: Math.floor(Math.random() * 999.99 * 100) / 100,
    check: Math.round(Math.random() * 1),
    noChangeNum: Math.floor(Math.random() * 99),
  });
}

export function queryACC(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  const dataSource = [...accDataSource];

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const current = parseInt(params.currentPage, 10) || 1;

  const start = (current - 1) * pageSize;

  const end = start + pageSize;

  const result = {
    list: dataSource.slice(start, end),
    pagination: {
      total: dataSource.length,
      pageSize,
      current,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function addACC(req, res) {
  const param = req.body;
  let data;
  if (param) {
    const id = accDataSource.length + 3;
    data = { ...param, id };
    accDataSource.splice(0, 0, data);
  }

  const result = {
    msg: 'ok',
    code: 0,
    data,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function uptACC(req, res) {
  const param = req.body;
  if (param) {
    const index = accDataSource.findIndex(element => element.id === param.id);
    accDataSource.splice(index, 1, param);
  }

  const result = {
    msg: 'ok',
    code: 0,
    data: param,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getACC(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const { id } = req.params;

  let data;
  if (id) {
    const intId = parseInt(id, 10);
    data = accDataSource.find(element => element.id === intId);
  }

  const result = {
    msg: 'ok',
    code: 0,
    data,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function delACC(req, res) {
  const { id } = req.params;

  if (id) {
    const intId = parseInt(id, 10);
    const index = accDataSource.findIndex(element => element.id === intId);
    accDataSource.splice(index, 1);
  }

  const result = {
    msg: 'ok',
    code: 0,
    data: id,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}
