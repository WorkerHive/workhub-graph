export const typeDef = `

  extend type Query {
    team: [TeamMember]
    teamMember(name: String): TeamMember
  }

  extend type Mutation {
    addTeamMember(member:TeamMemberInput):TeamMember
    updateTeamMember(memberId:String, member:TeamMemberInput):TeamMember
  }

  input TeamMemberInput {
    name: String
    email: String
    phoneNumber: String
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
      let team = await context.connections.flow.request("Team Members")
      console.log(team)
      return team;
    },
    teamMember: () => {
    
    }
  },
  Mutation: {
    addTeamMember: async (parent, {member}, context) => {
      return await context.connections.flow.add("Team Members", member)
    },
    updateTeamMember: async(parent, {memberId, member}, context) => {
      return await context.connections.flow.put("TeamMembers", memberId, member)
    }
  },
  TeamMember: {

  }
}
