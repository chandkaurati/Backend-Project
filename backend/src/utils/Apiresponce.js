class ApiResponce {
  constructor(messege = "ok", data,  status = 200, ) {
    this.messege = messege;
    this.status = status;
    this.data = data;
  }
}

export default ApiResponce;
