export const typeDef = `
  extend type Query {
    equipment: [Equipment]
  }

  type Equipment {
    "A piece of equipment"
    id: ID
    name: String
    type: String
    description: String
  }
`

export const resolvers = {
  Query: {
    equipment: async (parent, args, context) => {
      let equipment = await context.connections.flow.request("equipment")
      return equipment
    }
  },
  Equipment: {

  }
}
