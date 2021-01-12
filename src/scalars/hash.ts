import crypto from 'crypto';
import { GraphQLScalarType, Kind } from "graphql";

export const HashScalar : GraphQLScalarType = new GraphQLScalarType({
    name: 'Hash',
    description: 'Sha256 Hash Expressed as a Scalar',
    parseValue(value){
        return crypto.createHash('sha256').update(value).digest('hex');
    },
    serialize(value){
        return value;
    },
    parseLiteral(ast){
        if(ast.kind == Kind.STRING){
            return crypto.createHash('sha256').update(ast.value).digest('hex')
        }
    }
})