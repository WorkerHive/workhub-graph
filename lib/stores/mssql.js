import sql from 'mssql';
import SQLAdapter from '../adapters/mssql.js';

export default async (config) => {
    console.log("=> Connecting to MSSQL Store", JSON.stringify(config))
    let db = await sql.connect(config)
    let adapter = SQLAdapter(db)

    return {
        db,
        layout: async () => {
        
            let tables = await adapter.request([], `SELECT * FROM sys.Tables`)
            let views = await adapter.request([], `SELECT * FROM sys.Views`)

            return views.recordset.concat(tables.recordset)
        },
        bucketLayout: async (bucketName) => {
            let info = await adapter.request([
                {
                    type: sql.VarChar,
                    key: 'tableName',
                    value: bucketName
                }
            ], `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME=@tableName`)
            return info.recordset.map((x) => ({
                name: x.COLUMN_NAME,
                datatype: x.DATA_TYPE
              }))
        }  
    }
}
