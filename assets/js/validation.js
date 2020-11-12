function validator() {
  this.isRequire = function (value) {
    return value.trim() ? undefined : "Vui lòng Nhập Trường này";
  };
  this.isEmail = function (value) {
    let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return regex.test(value) ? undefined : "Trường này phải là Email";
  };
  this.isPhone = function (value) {
    let regex = /^\d{10}$/;
    return value.match(regex) ? undefined : "Trường này phải là số điện thoại";
  };
}
