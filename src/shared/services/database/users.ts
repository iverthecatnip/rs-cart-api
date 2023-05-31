import {getFromDB} from "./functions";
import {QUERIES} from "./queries";

export const createUser = async () => {
    const { data } = await getFromDB(QUERIES.CREATE_USER);
    if(data.length) {
        return data[0].id;
    }
    return null
}
