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
          let files = await context.connections.flow.request("Files")
          return files
        },
        file: (parent, args) => {
          
        },
        converters: (parent, {sourceFormat}, context) => {
          return context.connections.files.getConverters(sourceFormat)
        }
    },
    Mutation: {
        uploadFile: (parent, args, context) => {
          return args.file.then(async file => {
            let stream = file.createReadStream()
          
            //Add file to IPFS
            let ipfsFile = await context.connections.files.upload(file.filename, stream)

            let files = await context.connections.flow.request("Files", {
              filename: file.filename,
              cid: ipfsFile.cid.toString()
            })

            if(files && files.length > 0){
              console.log("FILES", files)
              return files[0]
            }else{
              let newFile = {
                cid: ipfsFile.cid.toString(),
                filename: file.filename,
                extension: fileExtension(file.filename),
              }
  
              //Add file to mongo store
              let _file = await context.connections.flow.add("Files", newFile)
              console.log("NEW FILES", _file)
              return _file
            }
              
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
