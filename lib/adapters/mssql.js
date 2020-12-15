import sql from 'mssql';
import { getFields, mapBack } from './object-map.js';


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

  cmd['updateProvider'] = (bucket, typeDef, provider_spec) => {

  }

  cmd['removeProvider'] = (bucket, typeDef, provider_spec) => {

  }
  
  cmd['addProvider'] = (bucket, typeDef, provider_spec) => {

  }

  cmd['provider'] =  (bucket, typeDef, provider_spec) => {
    let q = `SELECT ` 
    let { fields, empty } = getFields(provider_spec)

    q += `${fields.join(', ')} FROM ${bucket.name}`

    return async (query) => {
      let info = await cmd.request([], q)
      return info.recordset.map((x) => {
        return mapBack(provider_spec, x)
      })
    }
  }
  return cmd;
}
