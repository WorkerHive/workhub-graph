export default [
    {
        name: "Projects",
        typeDef: {
            id: "ID",
            name: "String",
            files: "[File]",
            description: "String",
            status: "String"
        },
        default: {
            type: 'mongo adapter',
            bucket: 'projects',
            provides: {
                id: "_id",
                name: "name",
                files: "N/A",
                description: "description",
                status: "status"
            }
        }
    },
    {
        name: "Team Members",
        typeDef: {
            id: "ID",
            name: "String",
            email: "String",
            phoneNumber: "String"
        },
        default: {
            type: 'mongo adapter',
            bucket: 'team',
            provides: {
                id: "_id",
                name: "name",
                email: "email",
                phoneNumber: "phoneNumber"
            }
        }
    },
    {
        name: "Equipment",
        typeDef: {
            id: "ID",
            name: "String",
            type: "String",
            description: "String"
        },
        default: {
            type: 'mongo adapter',
            bucket: 'equipment',
            provides: {
                id: "_id",
                name: "name",
                type: "type",
                description: "description"
            }
        }
    },
    {
        name: "Files",
        typeDef: {
            id: "ID",
            filename: "String",
            cid: "String",
            extension: "String"
        },
        default: {
            type: 'mongo adapter',
            bucket: 'files',
            provides: {
                id: "_id",
                cid: "cid",
                filename: "name",
                extension: "extension"
            }
        }
    }
]