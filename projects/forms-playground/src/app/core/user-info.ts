export interface UserInfo {
  firstName: string;
  lastName: string;
  nickname: string;
  email: string;
  yearOfBirth: number;
  passport: string;
  address: {
    fullAddress: string;
    city: string;
    postCode: string;
  }
  password: string;
  confirmPassword: string;
}
