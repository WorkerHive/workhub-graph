import { makeExecutableSchema } from "@graphql-tools/schema";
import { SchemaComposer, schemaComposer } from "graphql-compose";
import { v4 } from 'uuid'
export default class RoleRegistry {
    private roles : Array<Role> = [];

    private composer: SchemaComposer<any> = schemaComposer.clone();
    
    constructor(){
        this.setupMutable();
    }

    get sdl(){
        return this.composer.toSDL();
    }

    get schema(){
        return makeExecutableSchema({typeDefs:this.sdl, resolvers: this.resolvers});
    }

    get resolvers(){
        return this.composer.getResolveMethods();
    }

    setupMutable(){
        this.composer.createObjectTC({
            name: 'Role',
            fields: {
                id: 'ID',
                name: 'String',
                permissions: 'JSON'
            }
        })

        this.composer.Query.addFields({
            'roles': {
                type: '[Role]',
                resolve: (parent, args, context) => {
                    return this.roles;
                }
            },
            'role': {
                type: 'Role',
                args: {
                    name: 'String'
                },
                resolve: (parent, args, context) => {
                    return this.roles[args.name];
                }
            }
        })

        this.composer.Mutation.addFields({
            addRole: {
                type: 'Role',
                args: {
                    name: 'String',
                    permissions: 'JSON'
                },
                resolve: (parent, args, context) => {
                    let role = {
                        id: v4(),
                        name: args.name, 
                        permissions: args.permissions
                    }
                    this.roles.push(role)
                    return role
                }
            },
            updateRole: {
                type: "Role",
                args: {
                    name: "String",
                    permissions:"JSON"
                },
                resolve: (parent, args, context) => {

                }
            },
            removeRole: {
                type: "Boolean",
                args: {
                    name: "String"
                },
                resolve: (parent, args, context) => {
                    
                }
            }
        })
    }
}

interface Role {
    id: string;
    name: string;
    permissions: Record<any, any>;
}