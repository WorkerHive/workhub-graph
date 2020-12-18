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
                files: "files",
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
            username: "String",
            password: "Hash",
            admin: "Boolean",
            status: "Status",
            email: "String",
            phoneNumber: "String"
        },
        default: {
            type: 'mongo adapter',
            bucket: 'users',
            provides: {
                id: "_id",
                name: "name",
                username: "username",
                password: "password",
                admin: "admin",
                status: "status",
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
            conversion: "[Conversion]",
            extension: "String"
        },
        default: {
            type: 'mongo adapter',
            bucket: 'files',
            provides: {
                id: "_id",
                cid: "cid",
                conversion: "conversion",
                filename: "name",
                extension: "extension"
            }
        }
    },
    {
        name: "Calendar",
        typeDef: {
            id: "ID",
            project: "Project",
            allDay: "Boolean",
            startTime: "Int",
            endTime: "Int",
            date: "Int",
            items: {
                equipment: "[Equipment]",
                team: "[TeamMember]"
            }
        },
        default: {
            type: 'mongo adapter',
            bucket: 'calendar',
            provides: {
                id: "_id",
                project: "projectId",
                allDay: "allDay",
                startTime: "startTime",
                endTime: "endTime",
                date: "date",
                items: "items"
            }
        }
    }
]
