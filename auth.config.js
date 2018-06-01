module.exports = {
  products: {
    write: 'ownerOnly'
  },
  comments: {
    read: 'ifAuthed',
    write: 'ownerOnly'
  },
  carts: {
    read: 'ownerOnly',
    write: 'ownerOnly'
  },
  orders: {
    read: 'ownerOnly',
    write: 'ownerOnly'
  }
};
