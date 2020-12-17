import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const typeDef = `

  extend type Query {
    users: [User]
  }

  extend type Mutation {
    login(username: String, password: String): UserToken
  }

  type UserToken {
    error: String
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
        let pwd = crypto.createHash('sha256').update(password).digest('hex')
        let user = await context.connections.app.request('users', {username: username, password: pwd}).toArray()
        if(user.length > 0){
            return {
              token: jwt.sign({
                name: user[0].name,
                username: user[0].username, 
                id: user[0]._id,
                admin: user[0].admin
              }, 'test')
            }
        }else{
          return {
            error: "No user found"
          }

        }
    }  
  },
  User: {

  }
}
