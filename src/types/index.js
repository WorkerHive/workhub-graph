import lodash from 'lodash';
import GraphQLJSON from 'graphql-type-json';
import Server from 'apollo-server';
const {GraphQLUpload } = Server;
const { GraphQLJSONObject } = GraphQLJSON
import { 
  typeDef as Project,
  resolvers as projectResolvers
} from './project.js';

import {
  typeDef as Team,
} from './team.js';

import {
  typeDef as Equipment,
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
  typeDef as Knowledge
} from './knowledge.js'

import {
  typeDef as Integrations,
  resolvers as integrationResolvers
} from './integrations.js';

import {
  typeDef as Contacts
} from './contact.js'

const { merge } = lodash;


export const resolvers = merge(projectResolvers, fileResolvers, userResolvers, integrationResolvers, calendarResolvers)
export const typeDefs = [Contacts, Knowledge, Project, Team, Equipment, File, User, Integrations, Calendar].join('\n')
