function redis_sanitize (sanStr) {
	return sanStr.replace(/[,.?<>{}[\]"':;!@#$%^&()\-+=~|/\\ ]/g, "\\$&");
}

async function safeSearch(redisClient, index, searchKey, searchVal) {
    var ret = await redisClient.ft.search(`${index}`, `@${searchKey}:{${redis_sanitize(searchVal)}}`);
    if (ret.total > 0) {
        if (ret.total == 1) {
            return ret.documents[0].value
        } else {
            // TODO idk
            return ret.documents[0].value
        }
    } else {
        return null
    }
}

module.exports = { redis_sanitize, safeSearch }