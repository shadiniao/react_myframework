export function login(req, res) {
  const { password, userName } = req.body;
  if (password === '888888' && userName === 'admin') {
    res.send({
      msg: 'ok',
      code: 0,
      data: 'admin',
    });
    return;
  }
  if (password === '123456' && userName === 'user') {
    res.send({
      msg: 'ok',
      code: 0,
      data: 'user',
    });
    return;
  }
  res.send({
    msg: 'error',
    code: 1,
  });
}

export function me(req, res) {
  const { token } = req.body;
  if (token === 'admin') {
    res.send({
      code: 0,
      msg: 'success',
      data: {
        username: '管理员',
        usertype: 'system',
      },
    });
    return;
  }
  if (token === 'user') {
    res.send({
      code: 0,
      msg: 'success',
      data: {
        username: '普通用户',
        usertype: 'private',
      },
    });
    return;
  }
  res.send({
    msg: 'error',
    code: 1,
  });
}

export function permission(req, res) {
  const { token } = req.body;

  if (token === 'user' || token === 'admin') {
    res.send({
      code: 0,
      msg: 'success',
      data: ['user', 'admin'],
    });
    return;
  }

  res.send({
    msg: 'error',
    code: 1,
  });
}
