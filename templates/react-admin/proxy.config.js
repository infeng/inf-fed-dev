let menus = [{
  index: 1,
  text: '系统管理',
  name: 'system',
  leaf: false,
  icon: 'setting',
  items: [{
    index: 1,
    text: '修改密码',
    name: 'editPassword',
    leaf: true,
    icon: '',
  }, {
    index: 4,
    text: '用户列表',
    name: 'operatorList',
    leaf: true,
  }],
}];

let operatorInfo = {
  operatorId: 1,
  name: '小明',
  username: 'ming',
  menus: menus,
};

let defaultDate1 = '2017-03-02';
let defaultDate2 = '2017-03-03 12:12:00';

const defaultResponse = (req, res) => {
  setTimeout(function() {
    res.json({
      status: 0,
    });
  }, 500);
}

function createResponse(responseData) {
  return (req, res) => {
    setTimeout(function() {
      let defaultRes = {
        status: 0,
      };
      res.json(Object.assign({}, defaultRes, responseData));
    }, 1000);
  };
}

let proxy = {
  'GET /getName': {status: 0, name: 'mary'},
  '/api/system/login': (req, res) => {
    setTimeout(function() {
      res.json({
        status: 0,
        des: '',
        operatorId: 1,
        token: '233',
        operatorInfo: operatorInfo,
      });
    }, 1000);
  },
  '/api/system/logout': defaultResponse,
  '/api/system/getOperatorInfo': (req, res) => {
    setTimeout(function() {
      res.json({
        status: 0,
        operatorInfo: operatorInfo,
      });
    }, 100);
  },
  '/api/user/editPassword': defaultResponse,
  '/api/user/getUserList': (req, res) => {
    setTimeout(function() {
      res.json({
        status: 0,
        infos: [{
          id: 1,
          userName: 'ming',
          name: '小明',
        }],
      });
    }, 100);
  },
  '/api/user/addUser': defaultResponse,
  '/api/user/editUser': defaultResponse,
};

var mock = true;

if (!mock) {
  proxy = { 
    'POST /api/*': 'http://192.168.40.151:8080/collection/',
  };
}

module.exports = proxy;