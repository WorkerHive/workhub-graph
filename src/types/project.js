import apollo from 'apollo-server';
import mongodb from 'mongodb';
const { gql } = apollo;

export const typeDef = `
  extend type Query {
    project(id: Int!): Project
    projects: [Project]
  }

  extend type Mutation {
    addProject(project: ProjectInput): Project
    updateProject(projectId: ID, project: ProjectInput): Project
    attachFileToProject(projectId: ID, fileId: ID): Project
    removeProject(projectId: ID): Boolean
  }

  input ProjectInput{
    name: String
    description: String
    status: String
  }

  type Project {
    "A series of work"
    id: ID
    name: String
    description: String
    startDate: Int 
    endDate: Int
    files: [File]
    status: String
  }
  `

export const resolvers =  {
    Query: {
      project: () => {},
      projects: async (parent, args, context) => {
        let result = await context.connections.flow.request("Projects")
        return result;
      }
    },
    Mutation: {
      addProject: async (parent, {project}, context) => {
        let result = await context.connections.flow.add("Projects", project)
        return result;
      },
      updateProject: async (parent, {projectId, project}, context) => {
        let result = await context.connections.flow.put("Projects", projectId, project);
        return result;
      },
      removeProject: async (parent, {projectId}, context) => {
        return await context.connections.flow.remove("Projects", projectId)
      },
      attachFileToProject: async (parent, {fileId, projectId}, context) => { 
        let files = await context.connections.flow.request("Projects", {id: projectId})
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
      description: (parent, args, context) => {
        console.log(parent)
      },
      files: async (parent, args, context) => {
        return await context.connections.flow.request("Files", {id: {$in: (parent.files || []).map(x => mongodb.ObjectId(x))}})
      }
    }
  }


