import apollo from 'apollo-server';
import mongodb from 'mongodb';
const { gql } = apollo;

export const typeDef = `

  extend type Mutation {
    attachFileToProject(projectId: ID, fileId: ID): Project
  }

  type Project @crud @configurable {
    "A series of work"
    id: ID
    name: String @input
    description: String @input
    startDate: Int @input
    endDate: Int @input
    files: [File]
    status: String @input
  }
  `

export const resolvers =  {
    Mutation: {
      attachFileToProject: async (parent, {fileId, projectId}, context) => { 
        let files = await context.connections.flow.get("Projects", {id: projectId})
        console.log("Attaching to", files)
        if(files && files.length > 0){
          console.log("Adding file", fileId, "to ", files)
          files = files[0].files || [];
          files.push(fileId)
          let result = await context.connections.flow.put("Projects", projectId, {files: files})
          return result;
        }
      }
    },
    Project: {
      files: async (parent, args, context) => {
        return await context.connections.flow.get("Files", {id: {$in: (parent.files || []).map(x => mongodb.ObjectId(x))}})
      }
    }
  }


