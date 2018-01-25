function findByUsername(username, database, callback) {
  process.nextTick(() => {
    const user = database.filter(user => user.username === username);

    if (user && user.length > 0) {
      callback(null, user[0]);
    } else {
      callback(new Error('Invalid username'));
    }
  });
}

function findById (id, database, callback) {
  process.nextTick(() => {
    const user = database.filter(user => user.id === id);

    if (user && user.length > 0) {
      callback(null, user[0]);
    } else {
      callback(new Error('Invalid user ID'));
    }
  });
}

function findByToken(token, database, callback) {
  process.nextTick(() => {
    const user = database.filter(user => user.apiToken === token);

    if (user && user.length > 0) {
      callback(null, user[0]);
    } else {
      callback(new Error('Invalid API token'));
    }
  });
}

module.exports =  {
  byUsername: findByUsername,
  byId: findById,
  byToken: findByToken
};
