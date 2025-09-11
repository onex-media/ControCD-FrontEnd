const nameRules = (v: string) => {
  return [(v: string) => /([A-Za-z-0-9]){4,}/.test(v)];
};

const emailRules = (v: string) => {
  return [(v: string) => /.+@.+\..+/.test(v)];
};

const passwordRules = (v: string) => {
  return [(v: string) => /([A-Za-z-0-9.*-?&%$#+]){6,}/.test(v)];
};

const repeatRules = (v1: string, v2: string) => {
  return [v1 == v2];
};

const telRules = (v: string) => {
  return [(v: string) => v.length <= 16 && v.length >= 8];
};

const numbersRules = (v: string | number) => {
  return [(v: string) => /([0-9]){18,20}/.test(v)];
};

const numberAccount = (v: string) => {
  return [(v: string) => /([0-9]){4,25}/.test(v)];
};

const nullable = () => {
  return true;
};

export {
  nameRules,
  emailRules,
  passwordRules,
  repeatRules,
  telRules,
  numbersRules,
  numberAccount,
  nullable,
};
