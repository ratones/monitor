class Globals extends Mn.Object{
  constructor(){
    super();
    this.anvelopefata = null;
    this.anvelopespate = null;
  }

  getAnvelopeFata(){
    return this.anvelopefata;
  }
  getAnvelopeSpate(){
    return this.anvelopespate;
  }
  setAnvelopeFata(value){
    this.anvelopefata = value;
  }
  setAnvelopeSpate(value){
    this.anvelopespate = value;
  }


}
export default new Globals();
