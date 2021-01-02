import apollo from 'apollo-server';
import mongodb from 'mongodb';
const { gql } = apollo;

export const typeDef = `
  type Knowledge @crud @configurable {
    "A series of work"
    id: ID
    title: String @input
    description: String @input
    content: String @input
    parent: String @input
    children: [Knowledge]
    links: [String]
  }
  `
