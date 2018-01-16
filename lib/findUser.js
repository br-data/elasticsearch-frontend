function findByUsername(username, database, callback) {
  process.nextTick(() => {
    const user = database.filter(user => user.username === username);

    if (user && user.length > 0) {
      callback(null, user[0]);
    } else {
      // callback(new Error({ message: 'Could not find user.' }));
      callback(null, null);
    }
  });
}

function findById (id, database, callback) {
  process.nextTick(() => {

    const idx = id - 1;

    if (database[id - 1]) {
      callback(null, database[idx]);
    } else {
      callback(new Error({ message: 'Could not find user.' }));
    }
  });
}

function findByToken(token, database, callback) {
  process.nextTick(() => {
    const user = database.filter(user => user.apiToken === token);

    if (user && user.length > 0) {
      callback(null, user[0]);
    } else {
      // callback(new Error({ message: 'Could not find API token.' }));
      callback(null, null);
    }
  });
}

module.exports =  {
  byUsername: findByUsername,
  byId: findById,
  byToken: findByToken
};
