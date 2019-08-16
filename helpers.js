const ensureFinalSemicolon = (str) => {
  return /;(\s*)?$/.test(str.trim()) ? str + ' ' : str + '; ';
};

const randomString = (length = 32, chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') => {
  let result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

module.exports = { ensureFinalSemicolon, randomString };