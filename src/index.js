import axios from 'axios';
const productAPI = axios.create({
  baseURL: process.env.API_URL
});

const rootEl = document.querySelector('.root');

const templates = {
  login: document.querySelector('#login').content,
  join: document.querySelector('#join').content,
  productList: document.querySelector('#product-list').content,
  productItem: document.querySelector('#product-item').content
}


function login(token) {
  localStorage.setItem('token', token);
  productAPI.defaults.headers['Authorization'] = `Bearer ${token}`;
  rootEl.classList.add('root--authed');
}

function logout() {
  localStorage.removeItem('token');
  delete productAPI.defaults.headers['Authorization'];
  rootEl.classList.remove('root--authed');
}

async function loginPage() {
  const fragment = document.importNode(templates.login, true);
  const formEl = fragment.querySelector('.login__form');
  formEl.addEventListener('submit', async e => {
    const payload = {
      username: e.target.elements.username.value,
      password: e.target.elements.password.value
    };
    e.preventDefault();
    const res = await productAPI.post('users/login', payload);
    login(res.data.token);
    indexPage();
  })
  render(fragment);
}

async function joinPage() {
  const fragment = document.importNode(templates.join, true);
  const formEl = fragment.querySelector('.join__form');
  formEl.addEventListener('submit', async e => {
    const payload = {
      username: e.target.elements.username.value,
      password: e.target.elements.password.value
    };
    e.preventDefault();
    const res = await productAPI.post('/users/register/', payload);
    if (payload.username == '') {
      formEl.querySelector('.join__alert').textContent = '아이디가 중복되었습니다. 다시 입력해주십시요'
    }
    indexPage();
  })
  render(fragment);
}



function render(fragment) {
  rootEl.textContent = "";
  rootEl.appendChild(fragment);
}


async function indexPage() {
  const res = await productAPI.get('product?_expand=user');
  const listFragment = document.importNode(templates.productList, true);

  listFragment.querySelector('.product__login-btn').addEventListener('click', e => {
    loginPage();
  })

  listFragment.querySelector('.product__logout-btn').addEventListener('click', e => {
    logout();
    indexPage();
  })

  listFragment.querySelector('.product__cart-btn').addEventListener('click', e => {
    // postFormPage();
  })

  listFragment.querySelector('.product__join-btn').addEventListener('click', e => {
    joinPage();
  })
  render(listFragment);
}


if (localStorage.getItem('token')) {
  login(localStorage.getItem('token'));
}

indexPage();
