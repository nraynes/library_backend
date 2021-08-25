import pgPromise from 'pg-promise';
const pgp = pgPromise({});


const dbParams = {
    platform: "postgresql",
    host: "localhost",
    port: "65079",
    username: "postgres",
    password: "mysecretpassword",
    database: "postgres"
};


const dbConnect = `${dbParams.platform}://${dbParams.username}:${dbParams.password}@${dbParams.host}:${dbParams.port}/${dbParams.database}`;



var db = pgp(dbConnect)


db.connect()
    .then(obj => {
        // console.log("connected to database...")
        obj.done();
    })
    .catch(error => {
        console.log('Database connection error...')
        console.log('ERROR:', error.message);
    });



export default db;