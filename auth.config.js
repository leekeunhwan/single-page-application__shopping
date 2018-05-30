module.exports = {
  products: {
    write: 'ownerOnly'
  },
  comments: {
    read: 'ifAuthed',
    write: 'ownerOnly'
  }
};
