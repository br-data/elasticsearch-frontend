const records = [
    { id: 1, username: 'user', password: 'password', displayName: 'BR Data', emails: [ { value: 'data@br.de' } ] }
];

exports.findById = function(id, cb) {
  process.nextTick(() => {
    const idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error(`User ${id} does not exist`));
    }
  });
};

exports.findByUsername = function(username, cb) {
  process.nextTick(() => {
    for (let i = 0, len = records.length; i < len; i++) {
      const record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
};
