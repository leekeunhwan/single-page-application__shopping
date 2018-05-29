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
  cartProductFrom: document.querySelector('#cart-product-form').content
}


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
      imgUrl: e.target.elements.preImg.value,
      productCount: e.target.elements.productCount.value,
      cost: e.target.elements.productCost.value,
      body: e.target.elements.body.value,
      bodyImgUrl: e.target.elements.bodyImg.value
    };
    const res = await productAPI.post('/product', payload);
    productPage(res.data.id);
  })
  render(fragment);
}



// 관리자만 사용할 수 있는 기능 - 상품 수정하기
async function editFormPage(productId) {
  const res = await productAPI.get(`/product/${productId}`);
  const fragment = document.importNode(templates.editForm, true);
  fragment.querySelector('.edit-form__title').value = res.data.title;
  fragment.querySelector('.edit-form__body').value = res.data.body;
  fragment.querySelector('.edit-form__imgUrl').value = res.data.imgUrl;
  fragment.querySelector('.edit-form__count').value = res.data.productCount;
  fragment.querySelector('.edit-form__cost').value = res.data.cost;
  fragment.querySelector('.edit-form__bodyImgUrl').value = res.data.bodyImgUrl;
  // 수정페이지에서 뒤로가기버튼 구현 , 뒤로가기를 누르면 수정하려던 원래본문으로 돌아간다
  fragment.querySelector('.edit-form__back-btn').addEventListener('click', e => {
    e.preventDefault();
    productPage(productId);
  })

  // 수정페이지에서 수정 submit event 구현
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
    const res = await productAPI.patch(`/product/${productId}`, payload);
    productPage(res.data.id);
  })
  render(fragment);
}


async function loginPage() {
  const res = await productAPI.get('users');
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
  const res = await productAPI.get('users');
  const fragment = document.importNode(templates.join, true);
  const formEl = fragment.querySelector('.join__form');
  formEl.addEventListener('submit', async e => {
    const payload = {
      username: e.target.elements.username.value,
      password: e.target.elements.password.value
    };
    e.preventDefault();
    const res = await productAPI.post('/users/register/', payload);
    // 보낸 결과가 user의 username과 일치할 경우 .join__alert의 textContetn를 아이디가 중복되었습니다. 다시 입력해주십시요로 바꿔주기
    loginPage();
  })
  render(fragment);
}

async function productPage(productId) {
  const res = await productAPI.get(`/product/${productId}`);
  const fragment = document.importNode(templates.productContent, true);
  let count = parseInt(fragment.querySelector('.product-content__count').value);
  let orderCount = fragment.querySelector('.product-content__count')
  let orderCost = fragment.querySelector('.product-content__cost')
  let cost = (res.data.cost) * 1;
  fragment.querySelector('.product-content__count-plus').addEventListener('click', () => {
    if (orderCount.value < res.data.productCount) {
      console.log(orderCount.value)
      console.log(res.data.productCount);
      console.log(count)
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
  fragment.querySelector('.product-content__back-btn').addEventListener('click', async e => {
    indexPage();
  })

  fragment.querySelector('.product-content__edit-btn').addEventListener('click', () => {
    editFormPage(productId);
  })
  fragment.querySelector('.product-content__delete-btn').addEventListener('click', async e => {
    const res = await productAPI.delete(`product/${productId}`);
    indexPage();
  })
  fragment.querySelector('.product-content__cart-btn').addEventListener('click', async e => {
    const res = await productAPI.post(`cart/`);
    indexPage();
  })
  if (localStorage.getItem('token')) {
    const commentsFragment = document.importNode(templates.comments, true);
    const commentsRes = await productAPI.get(`/product/${productId}/comment`);
    commentsRes.data.forEach(comment => {
      const itemFragment = document.importNode(templates.commentItem, true);
      const authorEl = itemFragment.querySelector('.comment-item__author');
      const bodyEl = itemFragment.querySelector('.comment-item__body');
      const removeButtonEl = itemFragment.querySelector('.comment-item__remove-btn');
      console.log(comment)
      bodyEl.textContent = comment.body;
      commentsFragment.querySelector('.comments__list').appendChild(itemFragment);
      removeButtonEl.addEventListener('click', async e => {
        bodyEl.remove();
        removeButtonEl.remove();
        const res = await productAPI.delete(`/comment/${comment.id}`)
        productPage(productId);
      })
    })
    const formEl = commentsFragment.querySelector('.comments__form');
    formEl.addEventListener('submit', async e => {
      e.preventDefault();
      const payload = {
        body: e.target.elements.body.value
      };
      const res = await productAPI.post(`/product/${productId}/comment`, payload)
      productPage(productId);
    })
    fragment.appendChild(commentsFragment);
  }
  render(fragment);
}

async function indexPage() {
  const res = await productAPI.get('product?_expand=user');
  const listFragment = document.importNode(templates.productList, true);

  listFragment.querySelector('.product__post-btn').addEventListener('click', e => {
    postProductPage();
  })

  listFragment.querySelector('.product__login-btn').addEventListener('click', e => {
    loginPage();
  })

  listFragment.querySelector('.product__logout-btn').addEventListener('click', e => {
    logout();
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
    fragment.querySelector('.product-item__author').textContent = product.user.username;
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


if (localStorage.getItem('token')) {
  login(localStorage.getItem('token'));
}


indexPage();
