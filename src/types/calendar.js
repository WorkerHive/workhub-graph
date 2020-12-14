
export const typeDef = `
extend type Query {
  calendar(startRange: Int, endRange: Int): [CalendarBooking]
}

extend type Mutation {
  addBooking(time: CalendarInput, booking: BookingInput): CalendarBooking
}

input CalendarInput {
    allDay: Boolean
    startTime: Int
    endTime: Int
    date: Int
}

input BookingInput {
    project: ID
    items: {
        equipment: [ID]
        team: [ID]
    }
}

type CalendarBooking {
    id: ID
    allDay: Boolean
    startTime: Int
    endTime: Int
    date: Int
    project: Project
    items: {
        equipment: [Equipment]
        team: [TeamMember]
    }
}

`

export const resolvers = {
Query: {
  calendar: async (parent, {startRange, endRange}, context) => {
    let q = {}
    if(startRange){
        q.startTime = {$gte: startRange}
    }

    if(endRange){
        q.endTime = {$lte: endRange}
    }

    let calendar = await context.connections.flow.request("Calendar", q)
    return calendar
  }
},
Mutation: {
  addBooking: async (parent, {time, booking}, context) => {
    
    let _booking = {
        ...time,
        ...booking
    }
    return await context.connections.flow.add("Calendar", _booking)
  },
}
}
