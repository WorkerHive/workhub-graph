export const objectFlip = (obj) => {
  const ret = {};
  Object.keys(obj).forEach(key => {
    ret[obj[key]] = key;
  });
  return ret;
}

export const getFields = (spec) =>{
    let fields = [];
    let empty = [];
    for(var k in spec){
        if(spec[k] != "N/A"){
            fields.push(spec[k])
        }else{
            empty.push(k)
        }
    }
    return {fields, empty}
}


export const mapQuery = (spec, query) => {
    let out = {}
    for(var k in query){
        out[spec[k]] = query[k]
    }
    return out;
}

export const mapForward = (spec, obj) => {
    let out = {}
    for(var k in spec){
        out[spec[k]] = obj[k];
    }
    return out;
}

export const mapBack = (spec, obj) => {
    let _spec = objectFlip(spec)
    let out = {}
    for(var k in _spec){
        out[_spec[k]] = obj[k] 
    }
    return out;
}