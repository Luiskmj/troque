class StringHelper {
  static hasNumbers(string) {
    return /\d/.test(string);
  }

  static getNumbers(string) {
    return string.replace(/\D/g, '');
  }
}

export default StringHelper;
