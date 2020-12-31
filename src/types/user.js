import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import mongodb from 'mongodb';

export const typeDef = `

  extend type Query {
    users: [User]
    getSignupLink(user: ID): SignupToken
  }

  extend type Mutation {
    login(username: String, password: String): UserToken
    signup(user: UserInput): UserToken
  }

  type SignupToken {
    validTo: Int
    token: String
  }

  type UserToken {
    error: String
    token: String
  }

  input UserInput {
    username: String
    password: String

    name: String
    email: String
    phoneNumber: String
  }

  type User {
    "A user in the workhub"
    id: ID
    username: String @input
    password: String @input
    name: String @input
    email: String @input
    phoneNumber: String @input
  }

`

export const resolvers = {
  Query: {
    users: () => {

    },
    getSignupLink: async (parent, {user}, context) => {
      return {
        token: jwt.sign({
          type: 'signup',
          userId: user
        }, 'test'),
        validTo: ((new Date().getTime() / 1000) + 24 * 60 * 60)
      }
    }
  },
  Mutation: {
    login: async (parent, {username, password}, context) => {
        let pwd = crypto.createHash('sha256').update(password).digest('hex')
        console.log(username, pwd, context.connections.flow)
        let user = await context.connections.flow.get('TeamMember', {username: username, password: pwd})
        console.log("USer attempt", user)
        if(user){
            return {
              token: jwt.sign({
                name: user.name,
                username: user.username, 
                id: user.id,
                admin: user.admin
              }, 'test')
            }
        }else{
          return {
            error: "No user found"
          }

        }
    },
    signup: async (parent, {user}, context) => {
      if(context.user.type == "signup"){
        let accounts = await context.connections.app.request('users', {_id: mongodb.ObjectId(context.user.userId), status: "pending"}).toArray()

        if(accounts.length > 0){
          //Update account details
        }else{
          return {error: "Account not available for signup"}
        }
      }else{
        return {error: "Wrong type of signup token supplied"}
      }
    }  
  },
  User: {

  }
}
