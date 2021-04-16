class optionSort {
  sortAz(values) {
    values.sort((a, b) => {
      let titleA = a.name.toLowerCase();
      let titleB = b.name.toLowerCase();
      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }
      return 0;
    });
    return values;
  }
  sortZa(values) {
    values.sort((a, b) => {
      let titleA = a.name.toLowerCase();
      let titleB = b.name.toLowerCase();
      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }
      return 0;
    });
    values.reverse();
    return values;
  }
}
