export const typeDef = `

  extend type Query {
    team: [TeamMember]
    teamMember(name: String): TeamMember
  }

  type TeamMember {
    "A member of your WorkHub Team"
    id: ID
    name: String
    email: String
    phoneNumber: String
  }

`

export const resolvers = {
  Query: {
    team: async (parent, args, context) => {
      let team = await context.connections.flow.request("team members")
      console.log(team)
      return team;
    },
    teamMember: () => {
    
    }
  },
  TeamMember: {

  }
}
