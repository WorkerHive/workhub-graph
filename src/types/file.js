export const typeDef = `

  extend type Query {
    files: [File]
    file(id:ID): File
  }

  extend type Mutation {
    uploadFile(file: Upload!): File
  }

  type File {
    id: ID
    cid: String
    filename: String
    extension: String
  }

`

export const resolvers = {
    Query:{
        files: () => {

        },
        file: (parent, args) => {

        }
    },
    Mutation: {
        uploadFile: (parent, args) => {

        }
    }
}