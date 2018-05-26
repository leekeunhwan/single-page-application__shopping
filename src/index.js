import axios from 'axios';
const productAPI = axios.create({
  baseURL: process.env.API_URL
});

const rootEl = document.querySelector('.root');


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

const templates = {
  login: document.querySelector('#login').content,
  productList: document.querySelector('#product-list').content,
  productItem: document.querySelector('#product-item').content
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
  render(listFragment);
}


if (localStorage.getItem('token')) {
  login(localStorage.getItem('token'));
}

indexPage();
