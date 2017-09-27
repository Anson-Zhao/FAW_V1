// config/database.js
module.exports = {
    'connection': {
        'multipleStatements': true,
        'connectionLimit' : 100,
        'host': '10.11.4.36',
        'user': 'AppUser',
        'password': 'Special888%',
        'port'    :  3306
    },
	'Login_db': 'Login_DB',
    'Login_table': 'users',
    'Upload_db': 'FAO'
};
