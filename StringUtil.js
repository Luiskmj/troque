class StringUtil {
  static isOnlyNumbers(value) {
    return /^[0-9]+$/.test(value);
  }

  static isOnlyLetters(value, shouldIgnoreWhitespaces) {
    return /^[a-zA-Z]+$/.test(
      shouldIgnoreWhitespaces ? StringUtil.removeWhitespaces(value) : value
    );
  }

  static removeWhitespaces(value) {
    return value.replace(/\s+/g, '');
  }

  static getAllNumbers(value) {
    return value.replace(/[^0-9]/g, '');
  }

  static hasSomeNumber(value) {
    return /[0-9]/g.test(value);
  }

  static capitalize(value) {
    return value[0].toUpperCase() + value.slice(1);
  }
}

export default StringUtil;
