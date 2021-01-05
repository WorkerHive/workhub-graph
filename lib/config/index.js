import fs from 'fs';

export default class ConfigStore{

    constructor(configFile = '/data/workhub.conf'){
        this.configFile = configFile
        if(fs.existsSync(configFile)){
            this.config = JSON.parse(fs.readFileSync(configFile));
        }else{
            this.config = {};
        }
    }

    get(key){
        return this.config[key];
    }

    updateConfig(key, value){
        this.config[key] = value;

        if(this.configFile){
            fs.writeFileSync(this.configFile, JSON.stringify(this.config), 'utf8')
        }
    }
}