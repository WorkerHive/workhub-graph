export default [
    {
        name: "Projects",
        typeDef: {
            id: "ID",
            name: "String",
            files: "[File]",
            description: "String",
            status: "String"
        }
    },
    {
        name: "Team Members",
        typeDef: {
            id: "ID",
            name: "String",
            email: "String",
            phoneNumber: "String"
        }
    },
    {
        name: "Equipment",
        typeDef: {
            id: "ID",
            name: "String",
            type: "String",
            description: "String"
        }
    },
    {
        name: "Files",
        typeDef: {
            id: "ID",
            filename: "String",
            extension: "String"
        }
    }
]