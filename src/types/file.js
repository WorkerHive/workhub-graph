import fs from 'fs';
import fileExtension from 'file-extension';

export const typeDef = `

  extend type Query {
    files: [File]
    file(id:ID): File
  }

  extend type Mutation {
    uploadFile(file: Upload!): File
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
          return files;
        },
        file: (parent, args) => {

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
        }
    }
}