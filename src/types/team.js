export const typeDef = `

  extend type Query {
    team: [TeamMember]
    teamMember(name: String): TeamMember
  }

  extend type Mutation {
    addTeamMember(member:TeamMemberInput):TeamMember
    updateTeamMember(memberId: String, member:TeamMemberInput):TeamMember
    removeTeamMember(memberId: ID): Boolean
  }

  input TeamMemberInput {
    username: String
    password: String
    status: String
    admin: Boolean
    name: String
    email: String
    phoneNumber: String
  }

  type Role {
    id: ID!
    name: String
  }

  type TeamMember {
    "A member of your WorkHub Team"
    id: ID
    username: String
    password: String
    status: String
    admin: Boolean
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
      if(!member.password) member.status = "pending"
      return await context.connections.flow.add("Team Members", member)
    },
    updateTeamMember: async(parent, {memberId, member}, context) => {
      return await context.connections.flow.put("Team Members", memberId, member)
    },
    removeTeamMember: async(parent, {memberId}, context) => {
      return await context.connections.flow.remove("Team Members", memberId)
    }
  },
  TeamMember: {

  }
}
