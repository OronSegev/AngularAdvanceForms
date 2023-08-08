export class User {
  constructor(
    public id: number,
    public name: string,
    public nickname: string,
    public coutnry: string,
    public disabled = false
  ) {}
}
