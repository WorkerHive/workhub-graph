export default class RoleRegistry {
    private roles;
    private composer;
    constructor();
    get sdl(): string;
    get schema(): import("graphql").GraphQLSchema;
    get resolvers(): import("graphql-compose/lib/SchemaComposer").GraphQLToolsResolveMethods<any>;
    setupMutable(): void;
}
