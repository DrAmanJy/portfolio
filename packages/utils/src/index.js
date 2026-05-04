export const capitalize = (str) => {
  if (typeof str !== 'string' || !str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
