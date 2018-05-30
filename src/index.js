import axios from 'axios';

const productAPI = axios.create({
  baseURL: process.env.API_URL,
});

const rootEl = document.querySelector('.root');

// 숫자 콤마 표시 위한 것
function commas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


// login
async function login(token) {
  localStorage.setItem('token', token);
  productAPI.defaults.headers['Authorization'] = `Bearer ${token}`;
  const res = await productAPI.get('/me');
  if (res.data.id === 1) {
    rootEl.classList.add('root--authed')
    rootEl.classList.add('root--admin')
  } else {
    rootEl.classList.add('root--authed');
  }
}

// logout
function logout() {
  localStorage.removeItem('token');
  delete productAPI.defaults.headers['Authorization'];
  rootEl.classList.remove('root--authed');
  rootEl.classList.remove('root--admin');
}

// template
const templates = {
  login: document.querySelector('#login').content,
  join: document.querySelector('#join').content,
  productList: document.querySelector('#product-list').content,
  productItem: document.querySelector('#product-item').content,
  productContent: document.querySelector('#product-content').content,
  comments: document.querySelector('#comments').content,
  commentItem: document.querySelector('#comments-item').content,
  editForm: document.querySelector('#edit-form').content,
  postProductForm: document.querySelector('#post-product-form').content,
  cartProduct: document.querySelector('#cart-product').content,
  cartProductForm: document.querySelector('#cart-product-item').content
}

// render
function render(fragment) {
  rootEl.textContent = "";
  rootEl.appendChild(fragment);
}

// 관리자만 사용할 수 있는 기능 - 상품 등록/삭제하기
async function postProductPage() {
  const fragment = document.importNode(templates.postProductForm, true);
  fragment.querySelector('.post-product-form__back-btn').addEventListener('click', e => {
    e.preventDefault();
    indexPage();
  })
  fragment.querySelector('.post-product-form').addEventListener('submit', async e => {
    e.preventDefault();
    const payload = {
      title: e.target.elements.title.value,
      imgUrl: e.target.elements.imgUrl.value,
      productCount: e.target.elements.productCount.value,
      cost: e.target.elements.productCost.value,
      body: e.target.elements.body.value,
      bodyImgUrl: e.target.elements.bodyImgUrl.value
    };
    const res = await productAPI.post('products', payload);
    productPage(res.data.id);
  })
  render(fragment);
}

// 관리자만 사용할 수 있는 기능 - 상품 수정하기
async function editFormPage(productId) {
  const res = await productAPI.get(`/products/${productId}`);
  const fragment = document.importNode(templates.editForm, true);
  fragment.querySelector('.edit-form__title').value = res.data.title;
  fragment.querySelector('.edit-form__body').value = res.data.body;
  fragment.querySelector('.edit-form__imgUrl').value = res.data.imgUrl;
  fragment.querySelector('.edit-form__count').value = res.data.productCount;
  fragment.querySelector('.edit-form__cost').value = res.data.cost;
  fragment.querySelector('.edit-form__bodyImgUrl').value = res.data.bodyImgUrl;
  fragment.querySelector('.edit-form__back-btn').addEventListener('click', e => {
    e.preventDefault();
    productPage(productId);
  })
  fragment.querySelector('.edit-form').addEventListener('submit', async e => {
    e.preventDefault();
    const payload = {
      title: e.target.elements.title.value,
      body: e.target.elements.body.value,
      productCount: e.target.elements.count.value,
      cost: e.target.elements.cost.value,
      imgUrl: e.target.elements.imgUrl.value,
      bodyImgUrl: e.target.elements.bodyImgUrl.value
    };
    const res = await productAPI.patch(`/products/${productId}`, payload);
    productPage(res.data.id);
  })
  render(fragment);
}

// 로그인 페이지
async function loginPage() {
  const fragment = document.importNode(templates.login, true);
  const pEl = fragment.querySelector('.login__alert');
  fragment.querySelector('.login__join').addEventListener('click', e => {
    e.preventDefault();
    joinPage();
  })
  fragment.querySelector('.login__home-btn').addEventListener('click', e => {
    e.preventDefault();
    indexPage();
  })
  const formEl = fragment.querySelector('.login__form');
  formEl.addEventListener('submit', async e => {
    const payload = {
      username: e.target.elements.username.value,
      password: e.target.elements.password.value
    };
    e.preventDefault();
    const res = await productAPI.post('users/login', payload).then(async (response) => {
      alert(`${payload.username}님 환영합니다.`)
      await login(response.data.token);
      indexPage();
    }, (error) => {
      if (error.response.status < 500 & error.response.status >= 400) {
        pEl.textContent = '로그인 정보가 틀립니다. 다시 입력해주세요';
      }
    })
  })
  render(fragment);
}

// 회원가입 페이지
async function joinPage() {
  const res = await productAPI.get('users');
  const fragment = document.importNode(templates.join, true);
  fragment.querySelector('.join__home-btn').addEventListener('click', e => {
    e.preventDefault();
    indexPage();
  })
  const formEl = fragment.querySelector('.join__form');
  const pEl = fragment.querySelector('.join__alert');
  formEl.addEventListener('submit', async e => {
    const payload = {
      username: e.target.elements.username.value,
      password: e.target.elements.password.value
    };
    e.preventDefault();
    const res = await productAPI.post('/users/register/', payload).then(((response) => {
      alert(`가입해주셔서 감사합니다`)
      loginPage();
    }), (error) => {
      if (error.response.status == 400) {
        pEl.textContent = '아이디가 중복되었습니다. 다시 입력부탁드립니다.';
      } else if (error.response.status > 500) {
        pEl.textContent = '서버쪽 문제가 발생하였습니다. 잠시 후에 다시 시도해주십시요'
      }
    })
  })
  render(fragment);
}

// 장바구니를 보여주는 페이지
async function cartPage() {
  const res = await productAPI.get(`/carts?_expand=product`)
  const fragment = document.importNode(templates.cartProduct, true)
  const pEl = fragment.querySelector('.cart-product__sum-cost')
  let sum = [];
  let sumCost;
  fragment.querySelector('.cart-product-item__back-btn').addEventListener('click', e => {
    indexPage()
  })
  fragment.querySelector('.product__logout-btn').addEventListener('click', e => {
    logout();
    alert('감사합니다! 즐거운 하루 되십시요!');
    indexPage();
  })
  fragment.querySelector('.cart-product-item__cancel-btn').addEventListener('click', async e => {
    const res = await productAPI.delete(`carts/`)
    alert('장바구니가 비었습니다.')
    indexPage()
  })
  res.data.forEach(cart => {
    const cartFragment = document.importNode(templates.cartProductForm, true)
    cartFragment.querySelector('.cart-product-item__img').src = cart.product.imgUrl
    cartFragment.querySelector('.cart-product-item__title').textContent = cart.product.title
    cartFragment.querySelector('.cart-product-item__count').textContent = cart.amount
    cartFragment.querySelector('.cart-product-item__product-cost').textContent = commas(cart.product.cost * cart.amount) + "원"
    sumCost = cart.product.cost * cart.amount
    sum.push(sumCost);
    sumCost = 0;
    cartFragment.querySelector('.cart-product-item__delete-btn').addEventListener('click', async e => {
      const res = await productAPI.delete(`carts/${cart.id}`)
      const resCart = await productAPI.get('carts')
      if (resCart.data.length == 0) {
        alert('장바구니가 비었습니다.')
        indexPage()
      } else {
        cartPage(res.data.id);
      }
    })
    for (let i = 0; i < sum.length; i++) {
      sumCost += sum[i]
    }
    pEl.textContent = `총 금액 : ${commas(sumCost)}원`;
    fragment.appendChild(cartFragment);
  })
  render(fragment);
}

// 상품을 보여주는 페이지
async function productPage(productId) {
  const res = await productAPI.get(`/products/${productId}`);
  const fragment = document.importNode(templates.productContent, true);
  let count = parseInt(fragment.querySelector('.product-content__count').value);
  const orderCount = fragment.querySelector('.product-content__count')
  const orderCost = fragment.querySelector('.product-content__cost')
  const formEl = fragment.querySelector('.product-content-form')
  const cost = (res.data.cost) * 1;
  fragment.querySelector('.product-content__count-plus').addEventListener('click', () => {
    if (orderCount.value < res.data.productCount) {
      count++;
      orderCount.value = count;
      orderCost.textContent = orderCount.value * cost + "원";
    }
  })
  fragment.querySelector('.product-content__count-minus').addEventListener('click', () => {
    if (orderCount.value >= 1) {
      count--;
      orderCount.value = count;
      orderCost.textContent = orderCount.value * cost + "원";
      if (orderCount.value == 0) {
        orderCost.textContent = "Sold Out";
      }
    }
  })
  fragment.querySelector('.product-content__img').src = res.data.imgUrl;
  fragment.querySelector('.product-content__title').textContent = res.data.title;
  fragment.querySelector('.product-content__cost').textContent = cost + "원";
  fragment.querySelector('.product-content__body').textContent = res.data.body;
  fragment.querySelector('.product-content__bodyImg').src = res.data.bodyImgUrl;
  fragment.querySelector('.product-content__cart-btn').addEventListener('click', async e => {
    e.preventDefault();
    if (localStorage.getItem('token')) {
      const payload = {
        amount: formEl.elements.amount.value
      }
      const res = await productAPI.post(`products/${productId}/carts`, payload);
      cartPage();
    } else {
      alert('로그인을 하셔야 이용하실 수 있습니다.')
      loginPage();
    }
  })
  fragment.querySelector('.product-content__back-btn').addEventListener('click', async e => {
    indexPage();
  })
  fragment.querySelector('.product__post-btn').addEventListener('click', e => {
    postProductPage();
  })
  fragment.querySelector('.product__cart-btn').addEventListener('click', e => {
    cartPage();
  })
  fragment.querySelector('.product-content__edit-btn').addEventListener('click', () => {
    editFormPage(productId);
  })
  fragment.querySelector('.product-content__delete-btn').addEventListener('click', async e => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const res = await productAPI.delete(`products/${productId}`);
      indexPage();
    } else {
      productPage(productId);
    }
  })
  if (localStorage.getItem('token')) {
    const commentsFragment = document.importNode(templates.comments, true);
    const commentsRes = await productAPI.get(`products/${productId}/comments?_expand=user`);
    commentsRes.data.forEach(comment => {
      const itemFragment = document.importNode(templates.commentItem, true);
      const authorEl = itemFragment.querySelector('.comment-item__author');
      const bodyEl = itemFragment.querySelector('.comment-item__body');
      const removeButtonEl = itemFragment.querySelector('.comment-item__remove-btn');
      authorEl.textContent = comment.user.username;
      bodyEl.textContent = comment.body;
      commentsFragment.querySelector('.comments__list').appendChild(itemFragment);
      removeButtonEl.addEventListener('click', async e => {
        bodyEl.remove();
        removeButtonEl.remove();
        const res = await productAPI.delete(`comments/${comment.id}`)
        productPage(productId);
      })
    })
    const formEl = commentsFragment.querySelector('.comments__form');
    formEl.addEventListener('submit', async e => {
      e.preventDefault();
      const payload = {
        body: e.target.elements.body.value
      };
      const res = await productAPI.post(`products/${productId}/comments`, payload)
      productPage(productId);
    })
    fragment.appendChild(commentsFragment);
  }
  render(fragment);
}

// 메인화면 페이지
async function indexPage() {
  const res = await productAPI.get('products?_expand=user');
  const listFragment = document.importNode(templates.productList, true);
  listFragment.querySelector('.product__post-btn').addEventListener('click', e => {
    postProductPage();
  })
  listFragment.querySelector('.navbar-brand').addEventListener('click', e => {
    indexPage();
  })
  listFragment.querySelector('.product__login-btn').addEventListener('click', e => {
    loginPage();
  })

  listFragment.querySelector('.product__logout-btn').addEventListener('click', e => {
    logout();
    alert('감사합니다! 즐거운 하루 되십시요!')
    indexPage();
  })

  listFragment.querySelector('.product__cart-btn').addEventListener('click', e => {
    cartPage();
  })

  listFragment.querySelector('.product__join-btn').addEventListener('click', e => {
    joinPage();
  })
  res.data.forEach(product => {
    const fragment = document.importNode(templates.productItem, true);
    const preEl = fragment.querySelector('.product__pre')
    const imgEl = fragment.querySelector('.product__img');
    const costEl = fragment.querySelector('.product__cost');
    const titleEl = fragment.querySelector('.product__title');
    imgEl.src = product.imgUrl;
    costEl.textContent = product.cost + "원";
    titleEl.textContent = product.title;
    preEl.addEventListener('click', e => {
      productPage(product.id);
    })
    listFragment.querySelector('.product-list').appendChild(fragment);
  })
  render(listFragment);
}


async function init() {
  if (localStorage.getItem('token')) {
    await login(localStorage.getItem('token'));
  }
  indexPage();
}

init();
