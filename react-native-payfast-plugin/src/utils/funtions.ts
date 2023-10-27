import { stringMd5 } from "react-native-quick-md5";

/**
 * @description This function removes all null, undefined, empty and false values from a map
 * @param map Map to be cleaned
 * @returns A string of the cleaned map and a new map with the cleaned values
 */
const clearNullValues = (map: Map<string, string | number>, passPhrase?: string): Map<string, string | number> => {
    let result = "";
    const newMap = new Map<string, string | number>();
    map.forEach((value: string | number, key) => {
        if (value !== null && value !== "" && value !== undefined && value) {
            result += `${key}=${encodeURIComponent(value.toString().trim()).replace(/%20/g, "+")}&`;
            newMap.set(key, value);
        }
    })

    result = result.slice(0, -1); // remove the last &

    if (passPhrase && passPhrase.length > 0) {
        result += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;
    }

    newMap.set("signature", stringMd5(result));
    return newMap;
};









export { clearNullValues }