
export const typeDef = `
  extend type Query {
    project(id: Int!): Project
    projects: [Project]
  }

  type Project {
    "A series of work"
    id: ID
    name: String
    description: String
    files: [File]
    status: String
  }
  `
export const resolvers =  {
    Query: {
      project: () => {},
      projects: async (parent, args, context) => {
        let result = await context.connections.flow.request("projects")
        return result;
       // let result = await context.connections.jsis.request([], 'SELECT JobID, JobName, Status FROM vw_Sched_Jobs')
       // return result.recordset.map((x) => ({name: x.JobName, id: x.JobID, status: x.Status}));
      }
    },
    Project: {
      description: (parent, args, context) => {
        console.log(parent)
      }
    }
  }


