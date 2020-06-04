const db = require('./db');

module.exports = {
  getAllClicks(){
    return [...db.values()];
  },
  save(data){
    db.add(data);
  }
}
