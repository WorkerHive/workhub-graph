export const typeDef = `

    type Contact @crud @configurable{
        id: ID
        name: String @input
        phoneNumber: String @input
        email: String @input
        history: [ContactOrganisation] @input(ref: true)
    }

    type ContactOrganisation @crud @configurable{
        id: ID
        name: String @input
        location: String @input
        contacts: [Contact] @input(ref: true)
    }

`