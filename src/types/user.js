import jwt from 'jsonwebtoken';

export const typeDef = `

  extend type Query {
    users: [User]
  }

  extend type Mutation {
    login(username: String, password: String): UserToken
  }

  type UserToken {
    token: String
  }

  type User {
    "A user in the workhub"
    id: ID
    username: String
    password: String
    name: String
    email: String
    phoneNumber: String
  }

`

export const resolvers = {
  Query: {
    users: () => {

    },
  },
  Mutation: {
    login: async (parent, {username, password}, context) => {
        let user = await context.connections.app.request('users', {username: username, password: password}).toArray()
        if(user.length > 0){
            return {
                token: jwt.sign({username: user[0].username, id: user[0].id}, 'test')
            }
        }else{
            throw Error("No such user found")
        }
    }  
  },
  User: {

  }
}
