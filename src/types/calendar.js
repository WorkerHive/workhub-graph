
export const typeDef = `
extend type Query {
  calendar(startRange: Int, endRange: Int): [CalendarBooking]
}

extend type Mutation {
  addBooking(time: CalendarInput, projectId: ID, booking: BookingInput): CalendarBooking
}

input CalendarInput {
    allDay: Boolean
    startTime: Int
    endTime: Int
    date: Int
}

input BookingInput {
    equipment: [ID]
    team: [ID]
}

type BookingItems {
    equipment: [Equipment]
    team: [TeamMember]
}

type CalendarBooking {
    id: ID
    allDay: Boolean
    startTime: Int
    endTime: Int
    date: Int
    project: Project
    items: BookingItems
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
  addBooking: async (parent, {time, projectId, booking}, context) => {
    console.log("ADD BOOKING", time, projectId, booking)
    let _booking = {
        ...time,
        project: projectId,
        items: booking
    }
    return await context.connections.flow.add("Calendar", _booking)
  },
},
CalendarBooking: {
  items: (parent, args, context) => {
    console.log("ITEMS", parent, args, context)
  },
  project: (parent, args, context) => {
    console.log("PROJECT", parent, args, context)
  }
}
}
