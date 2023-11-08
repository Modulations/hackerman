/**
 * @param {string} sanStr String to sanitize for Redis DB search use.
 */
function redis_sanitize (sanStr) {
	return sanStr.replace(/[,.?<>{}[\]"':;!@#$%^&()\-+=~|/\\ ]/g, "\\$&");
}

/**
 * @param {redisClient} redisClient Redis connection to use.
 * @param {string} index Index table to search with.
 * @param {string} searchKey Key to search by.
 * @param {string} searchVal Value to search for.
 * @param {string} nullProt If you want the returned object to be a null prototyped object. (Default: false)
 */
async function safeSearch(redisClient, index, searchKey, searchVal, nullProt = false) {
    // WARNING: FT.Search by default returns a null prototyped object.
    // this means it does NOT inherit .toString and other properties
    // 
    var ret = await redisClient.ft.search(`${index}`, `@${searchKey}:(${redis_sanitize(searchVal)})`);
    if (ret.total > 0) {
        if (ret.total == 1) {
            if (nullProt == true) { return ret.documents[0].value }
            return JSON.parse(JSON.stringify(ret.documents[0].value))
        } else {
            // TODO idk
            console.log("warning: safeSearch returned", ret.total, "documents. returned 0th entry")
            if (nullProt == true) { return ret.documents[0].value }
            return JSON.parse(JSON.stringify(ret.documents[0].value))
        }
    } else {
        return null
    }
}

module.exports = { redis_sanitize, safeSearch }