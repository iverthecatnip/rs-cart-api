import {Client} from "pg";

const connect = async () => {
    const client = new Client({
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
    });

    try {
        await client.connect()
    } catch (e) {
        console.error('DB connection error')
        console.error(e)
    }
    return client;
}

export const getFromDB = async (query, values = []) => {
    const client = await connect();
    let response;
    let error = false;
    try {
        const { rows }  = await client.query(query, values)
        response = rows;
    } catch (e) {
        console.error('DB Error')
        console.error(e)
        error = true;
    }
    client.end();
    if(error){
        return {data: [], error: 'Unexpected database error'}
    }


    if(response.length){
        return {data: response, error: null};
    }else{
        return {data: [], error: 'Not found'};
    }
}


export const updateDB = async (query, values = []) => {
    const client = await connect();
    let error = false;

    try {
        await client.query(query, values)
    } catch (e) {
        console.error('DB Error')
        console.error(e)
        error = true;
    }
    client.end();

    if(error){
        console.log('error')
        console.log(error)
        return {error: 'Unexpected database error'}
    }

    return {error: null};
}
