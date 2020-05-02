export interface IResData {
  status: Number;
  data: any;
  message: String;
}
export interface IUser {
  UserId: Number;
  FirstName: String;
  LastName: String;
  FullName: String;
  Email: String;
  Password: String;
  Language: String;
  AvatarURL: String;
  DateTimeCreated: Date;
  isAtive: Number;
}
