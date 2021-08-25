import pgPromise from 'pg-promise';
const pgp = pgPromise({});


const dbParams = {
    platform: "postgresql",
    host: "localhost",
    port: "5432",
    username: "postgres",
    password: "mysecretpassword",
database: "postgres"
};


const dbConnect = `${dbParams.platform}:${dbParams.username}:${dbParams.password}@${dbParams.host}:${dbParams.port}/${dbParams.database}`;



var db = pgp(dbConnect)


db.connect()
    .then(obj => {
        const serverVersion = obj.cl.serverVersion;
        console.log(`Connected to dase, version `, serverVersion)
        obj.done();
    })
    .catch(error => {
        console.log('Database connec error...')
        console.log('ERROR:', error.message);
    });



export default db;