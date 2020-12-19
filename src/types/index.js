import lodash from 'lodash';
import GraphQLJSON from 'graphql-type-json';
const { GraphQLJSONObject } = GraphQLJSON
import { 
  typeDef as Project,
  resolvers as projectResolvers
} from './project.js';

import {
  typeDef as Team,
  resolvers as teamResolvers
} from './team.js';

import {
  typeDef as Equipment,
  resolvers as equipmentResolvers
} from './equipment.js'

import {
  typeDef as Calendar,
  resolvers as calendarResolvers
} from './calendar.js';

import {
  typeDef as File,
  resolvers as fileResolvers
} from './file.js'

import {
  typeDef as User,
  resolvers as userResolvers
} from './user.js';

import {
  typeDef as Integrations,
  resolvers as integrationResolvers
} from './integrations.js';

const { merge } = lodash;

const Query = `
scalar JSON
scalar JSONObject
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`

const _resolvers = {
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject
}

export const resolvers = merge(_resolvers, projectResolvers, teamResolvers, equipmentResolvers, fileResolvers, userResolvers, integrationResolvers, calendarResolvers)
export const typeDefs = [Query, Project, Team, Equipment, File, User, Integrations, Calendar]
