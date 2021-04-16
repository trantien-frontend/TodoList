function validator() {
  this.isRequire = function (value) {
    return value.trim() ? true : 'Vui lòng Nhập Trường này';
  };
  this.isEmail = function (value) {
    let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return regex.test(value) ? true : 'Trường này phải là Email';
  };
  this.isPhone = function (value) {
    let regex = /^\d{10}$/;
    return value.match(regex) ? true : 'Trường này phải là số điện thoại';
  };
}
