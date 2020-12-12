import { gql } from 'apollo-server';

export const typeDef = `
  extend type Query {
    project(id: Int!): Project
    projects: [Project]
  }

  extend type Mutation {
    addProject(project: ProjectInput): Project
    updateProject(projectId: ID, project: ProjectInput): Project
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
      }
    },
    Project: {
      description: (parent, args, context) => {
        console.log(parent)
      },
    }
  }


