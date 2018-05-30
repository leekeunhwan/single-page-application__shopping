module.exports = {
  products: {
    write: 'ownerOnly'
  },
  comments: {
    read: 'ifAuthed',
    write: 'ownerOnly'
  },
  carts: {
    read: 'ifAuthed',
    write: 'ownerOnly'
  }
};
