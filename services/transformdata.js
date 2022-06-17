function transformString(str) {
    let temp = str.trim();
    let data = temp.split(' ');

    return data;
}

function transformHexToDec(str) {
    let temp = '';
  
	for (var i = 0 ; i < str.length; i++)
	{
		temp += str.charCodeAt(i).toString() + " ";
	}
  
    return temp;
}

module.exports = {
    transformString,
    transformHexToDec
}