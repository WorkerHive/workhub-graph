import fs from 'fs';
import fileExtension from 'file-extension';
import mongodb from 'mongodb';

export const typeDef = `

  extend type Query {
    files: [File]
    file(id:ID): File
    converters(sourceFormat: String): [Converter]
  }

  extend type Mutation {
    uploadFile(file: Upload!): File
    convertFile(fileId: ID, targetFormat: String): ConversionStatus
  }

  type Converter {
    sourceFormat: String
    targetFormat: String
    pipeline: String
  }
  
  type ConversionStatus {
    msg: String
    error: String
  }

  type File {
    id: ID!
    cid: String
    filename: String
    extension: String
  }

`

export const resolvers = {
    Query:{
        files: async (parent, args, context) => {
          let files = await context.connections.app.request('files', {}).toArray()
          return files.map((x) => ({
            id: x._id,
            ...x,
          }));
        },
        file: (parent, args) => {

        },
        converters: (parent, {sourceFormat}, context) => {
          return context.connections.files.getConverters(sourceFormat)
        }
    },
    Mutation: {
        uploadFile: (parent, args, context) => {
          args.file.then(async file => {
            let stream = file.createReadStream()
            
            let ipfsFile = await context.connections.files.upload(file.filename, stream)
            console.log(ipfsFile.cid.toString(), ipfsFile.cid)
            let newFile = {
              cid: ipfsFile.cid.toString(),
              filename: file.filename,
              extension: fileExtension(file.filename),

            }
            await context.connections.app.add('files', newFile)
          })
        },
        convertFile: async (parent, {fileId, targetFormat}, context) => {
          let files = await context.connections.app.request('files', {_id: mongodb.ObjectId(fileId)}).toArray()
          console.log("Convert", files, targetFormat, fileId)
          if(files && files.length > 0){
            return await context.connections.files.convert(files[0].cid, files[0].extension, targetFormat)
          }else{
            return {error: "No file found matching that description"}
          }

        }
    }
}
