import sql from 'mssql';

const objectFlip = (obj) => {
  const ret = {};
  Object.keys(obj).forEach(key => {
    ret[obj[key]] = key;
  });
  return ret;
}

export default (db) => {
 
  let cmd =  {
    request: (inputs, query) => {
      let r = new sql.Request();
      if(inputs && inputs.length > 0){
        for(var i = 0; i < inputs.length; i++){
          r.input(inputs[i].key, inputs[i].type, inputs[i].value)
        }
      }
      return r.query(query)
    }
  }

  cmd['provider'] =  (bucket, provider_spec) => {
    let q = `SELECT ` 
    let fields = []
    let consumer_spec = objectFlip(provider_spec)
    for(var k in provider_spec){
      if(provider_spec[k] != "N/A"){
        fields.push(provider_spec[k])
      }
    }
    q += `${fields.join(', ')} FROM ${bucket.name}`

    console.log(q, fields, provider_spec)
    return async () => {
      let info = await cmd.request([], q)
      return info.recordset.map((x) => {
        let out = {}
        for(var k in consumer_spec){
          out[consumer_spec[k]] = x[k] 
        }
        return out;
      })
    }
  }
  return cmd;
}
