function transformString(str) {
    let temp = str.trim();
    let data = temp.split(' ');

    return data;
}

module.exports = {
    transformString,
}