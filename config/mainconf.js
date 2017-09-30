// config/database.js
module.exports = {
    'commondb_connection': {
        'multipleStatements': true,
        'connectionLimit' : 100,
        'host': '127.0.0.1',
        'user': 'AppUser',
        'password': 'Special888%',
        'port'    :  3306
    },
    'session_connection': {
        'multipleStatements': true,
        'connectionLimit' : 100,
        'host': '127.0.0.1',
        'user': 'SessionManager',
        'password': 'SManager$44',
        'port'    :  3306
    },

    'Session_db': 'session_DB',
    'Login_db': 'Login_DB',
    'Login_table': 'users',
    'Upload_db': 'FAO',

    'Server_Port': 9088,

    'Upload_Path': '/Users/ftaaworldbridgelab/Desktop/Test'

};
