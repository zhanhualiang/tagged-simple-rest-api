const mysql = require('mysql');

const pool = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '13288625242LZH37',
    database: 'tagged_db'
});

pool.connect();

exports.getAllUsers = async () => {

    try {
        return await new Promise((resolve) => {
            pool.query('SELECT * FROM users', (error, results, fields) => {
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
        return false;
    }

}
/*
exports.getAllUsers = () => {
    var output;
    try {
        var result = await pool.query('SELECT * FROM users', (error, results, fields) => {
            if (error) throw error;
            console.log('result');
            console.log(results);
            output = results;
            console.log('inside');
            console.log(output);
            return results;
        });
    } catch (e) {
        console.log("Something went wrong when getting all users!");
        console.log(e);
        return e;
    }
    console.log('outside');
    console.log(output);

}
*/

exports.getUserInfo = async (id) => {
    try {
        return await new Promise((resolve) => {
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
        return false;
    }
}

exports.getUserTasksOfDate = async (id, date) => {
    try {
        return await new Promise((resolve) => {
            pool.query(`SELECT title, description, task_order, finish, share FROM tasks WHERE uid=${id} AND DATE(create_at)=DATE('${date}')`, (error, results) => {
                if (error) {
                    throw error;
                }
                console.log(results);
                resolve(results);
            });
        })
    } catch (err) {
        console.error(err);
        return false;
    }
}

exports.registerUser = async (email, pw, name) => {
    try {
        if (email && pw && name) {
            return await new Promise((resolve, reject) => {
                pool.query(`SELECT * FROM users WHERE email='${email}'`, (error, results) => {
                    if (error) {
                        reject(error.code);
                    }
                    if(results.length > 0) {
                        reject('E-mail already exist!')
                    } else {
                        pool.query(`INSERT INTO users (email, password, name) VALUE ('${email}', SHA1('${pw}'), '${name}')`,(e, r) => {
                            if (e) throw e;
                            if (r.insertId) resolve('Sign-up successful!');
                        });
                    }
                });
            })
        } else throw 'missing query params!'

    } catch (err) {
        console.error(err);
        return err;
    }
}


