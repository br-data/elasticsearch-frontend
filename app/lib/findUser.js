function findByUsername (username, database, callback) {
  process.nextTick(() => {
    for (let i = 0, len = database.length; i < len; i++) {
      const record = database[i];
      if (record.username === username) {
        return callback(null, record);
      }
    }
    return callback(null, null);
  });
}

function findById (id, database, callback) {
  process.nextTick(() => {
    const idx = id - 1;
    if (database[idx]) {
      callback(null, database[idx]);
    } else {
      callback(new Error(`User ${id} does not exist`));
    }
  });
}

module.exports =  {
  byUsername: findByUsername,
  byId: findById
};
