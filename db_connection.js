const mysql = require('mysql');

const pool = mysql.createPool({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '13288625242LZH37',
    database: 'tagged_db'
});

// Get all users' info.
exports.getAllUsers = () => {
    try {
        return new Promise((resolve) => {
            pool.query('SELECT * FROM users', (error, results) => {
                if (error) {
                    throw error;
                }
                console.log(results);
                resolve(results);
            });
        })
    }
    catch (err) {
        console.error(err);
        return {'respond': false};
    }

}

//Get user info with id.
exports.getUserInfo = (id) => {
    try {
        return new Promise((resolve) => {
            pool.query(`SELECT name, email FROM users WHERE id=${id}`, (error, results) => {
                if (error) {
                    throw error;
                }
                console.log(results);
                resolve(results);
            });
        })
    } catch (err) {
        console.error(err);
        return {'respond': false};
    }
}

//Get user's tasks of the day with id & date.
exports.getUserTasksOfDate = (id, date) => {
    try {
        return new Promise((resolve) => {
            pool.query(`SELECT id, uid, title, description, task_order, DATE_FORMAT(date, '%Y-%m-%d') AS date, finish, share FROM tasks WHERE uid=${id} AND date=DATE('${date}') ORDER BY task_order`, (error, results) => {
                if (error) {
                    throw error;
                }
                console.log(results);
                resolve(results);
            });
        })
    } catch (err) {
        console.error(err);
        return {'respond': false};
    }
}

// Post user's data for sign-up.
exports.registerUser = (email, pw, name) => {
    try {
        if (email && pw && name) {
            return new Promise((resolve, reject) => {
                pool.query(`SELECT * FROM users WHERE email='${email}'`, (error, results) => {
                    if (error) {
                        reject({'respond': error.code});
                    }
                    if (results.length > 0) {
                        reject({'respond': 'E-mail already exist!'})
                    } else {
                        pool.query(`INSERT INTO users (email, password, name) VALUE ('${email}', SHA1('${pw}'), '${name}')`, (e, r) => {
                            if (e) throw e;
                            if (r.insertId) resolve({'respond':'Sign-up successful!'});
                        });
                    }
                });
            }).catch((e) => {
                console.error(e);
                return {'error': e};
            })
        } else throw 'Missing query params!'

    } catch (err) {
        console.error(err);
        return {'respond':'Missing query params!'};
    }
}

//Add task.
exports.addTask = async (uid, title, desc, taskOrder, share, date) => {
    return new Promise((resolve, reject) => {

            pool.query(`INSERT INTO tasks (uid, title, description, task_order, share, date) VALUE (${uid}, '${title}', '${desc}', '${taskOrder}', '${share}', DATE('${date}'))`, (error, result) => {
                if (error) reject({resopnd: error.code});
                if (result) {
                    console.log(`Add task successful! Result: ${result.insertId}`);
                    resolve({respond: 'Add task successful!'});
                }
            });

    }).catch((e) => {
        console.error(e);
        return {respond: false};
    });
}

//Update Task.
exports.updateTask = async (taskId, title, desc, taskOrder, share) => {
    return new Promise((resolve, reject) => {
            pool.query(`UPDATE tasks 
                SET title='${title}', description='${desc}', task_order=${taskOrder}, share=${share}
                WHERE id=${taskId}`, (error, result) => {
                if (error) reject(error);
                if (result) {
                    console.log(`Update task successful!`);
                    resolve({respond: 'Update task successful!'});
                }
            });

    }).catch((e) => {
        console.error(e);
        return {respond: false};
    });
}

//Update task order.
exports.updateTaskOrder = async (taskId, taskOrder) => {
    return new Promise((resolve, reject) => {
            pool.query(`UPDATE tasks 
                SET task_order=${taskOrder}
                WHERE id=${taskId}`, (error, result) => {
                if (error) reject(error);
                if (result) {
                    console.log(`Update task Order successful!`);
                    resolve({respond: 'Update task Order successful!'});
                }
            });

    }).catch((e) => {
        console.error(e);
        return {respond: false};
    });
}

//Delete task.
exports.deleteTask = async (taskId) => {
    return new Promise((resolve, reject) => {
            pool.query(`DELETE FROM tasks WHERE id=${taskId}`, (error, result) => {
                if (error) reject(error);
                if (result) {
                    console.log(`Delete task successful!`);
                    console.log(result);
                    resolve({respond: 'Delete task successful!'});
                }
            });

    }).catch((e) => {
        console.error(e);
        return {respond: false};
    });
}

//Simple sign-in.
exports.signIn = async (email, pw) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM users WHERE email='${email}' AND password=SHA1('${pw}')`, (error, result) => {
            if(error) reject(error);
            if(result) {
                console.log(`User ${email} try to log in.`);
                resolve({respond: `Log in successful!`});
            }
        });
    }).catch((e) => {
        console.error(e);
        return {respond: 'Password is incorrect or E-mail doesn\'t exist!'};
    });
}


