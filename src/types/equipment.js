
export const typeDef = `
  extend type Query {
    equipment: [Equipment]
  }

  extend type Mutation {
    addEquipment(equipment: EquipmentInput): Equipment
    updateEquipment(equipmentId:String, equipment:EquipmentInput): Equipment
  }

  input EquipmentInput {
    name: String
    type: String
    description: String
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
      let equipment = await context.connections.flow.request("Equipment")
      return equipment
    }
  },
  Mutation: {
    addEquipment: async (parent, {equipment}, context) => {
      return await context.connections.flow.add("Equipment", equipment)
    },
    updateEquipment: async(parent, {equipmentId, equipment}, context) => {
      return await context.connections.flow.put("Equipment", equipmentId, equipment)
    }
  },
  Equipment: {

  }
}
