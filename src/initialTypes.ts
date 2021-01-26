export const initialTypes = (initialTypes: string) => `
type Query {
    empty: String
}

type Mutation {
    empty: String
}

type Subscription {
    empty: String
}
${initialTypes}

type Role @crud @configurable {
    id: ID
    name: String @input
    permissions: JSON @input
}
`