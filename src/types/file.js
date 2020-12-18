import fs from 'fs';
import fileExtension from 'file-extension';
import mongodb from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';

export const typeDef = `

  extend type Query {
    files: [File]
    file(id:ID): File
    converters(sourceFormat: String): [Converter]
  }

  extend type Mutation {
    uploadFile(file: Upload!): FileUploadResult
    installConverter(converterId: ID): Boolean
    convertFile(fileId: ID, targetFormat: String): ConversionStatus
  }

  type FileUploadResult {
    error: String
    duplicate: Boolean
    file: File
  }

  type Converter {
    id: ID
    name: String
    sourceFormat: String
    targetFormat: String
    installed: Boolean
    pipeline: Pipeline
  }

  type Pipeline{
    steps: [PipelineWorkers]
    links: [PipelineLinks]
    finalQueue: String
  }

  type PipelineLinks {
    id: ID
    source: String
    target: String
  }

  type PipelineWorkers {
    id: ID
    dockerImage: String
    queue: String
    input: String
    output: String
  }
  
  type ConversionStatus {
    msg: String
    error: String
  }

  type Conversion {
    extension: String
    cid: String
  }

  type File {
    id: ID!
    cid: String
    filename: String
    conversion: Conversion
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
          if(!sourceFormat){
            return context.connections.pipeline.getPipelines();
          }else{
            return context.connections.pipeline.getPipelineFormat(sourceFormat)
          }
        }
    },
    Mutation: {
      installConverter: (parent, {converterId}, context) => {
        context.connections.pipeline.getPipeline(converterId).pullSteps()
        context.connections.app.add('converter', {installed: true, converter: converterId})
      },
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
              return {
                duplicate: true,
                file: files[0]
              }
            }else{
              let newFile = {
                cid: ipfsFile.cid.toString(),
                filename: file.filename,
                extension: fileExtension(file.filename),
              }
  
              //Add file to mongo store
              let _file = await context.connections.flow.add("Files", newFile)
              console.log("NEW FILES", _file)
              return {
                duplicate: false,
                file: _file
              }
            }
              
          })
        },
        convertFile: async (parent, {fileId, targetFormat}, context) => {
          let files = await context.connections.app.request('files', {_id: mongodb.ObjectId(fileId)}).toArray()
          console.log("Convert", files, targetFormat, fileId)
          if(files && files.length > 0){

            let job_id = uuidv4()
            await context.connections.app.add('pipeline-job', {
              job_id: job_id,
              type: 'file-conversion',
              targetFormat: targetFormat,
              cid: files[0].cid,
              fileId: fileId
            })
            
            let pipeline = context.connections.pipeline.getPipelineFormat(files[0].extension, targetFormat)
            
            let queue = pipeline.runPipeline(job_id, files[0].cid)

            //return await context.connections.files.convert(files[0].cid, files[0].extension, targetFormat)
          }else{
            return {error: "No file found matching that description"}
          }

        }
    },
    Converter: {
      installed: async (parent, args, context) => {
        let verter = await context.connections.app.request('converter', {converter: parent.id}).toArray()
        if(verter && verter.length > 0){
          return verter[0].installed;
        }else{
          return false;
        }
      }
    }
}
