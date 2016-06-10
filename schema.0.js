import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} from 'graphql';

import Db from "./db";

const Post = new GraphQLObjectType({
    name: 'Post',
    description: 'Blog post',
    fields: () => {
        return {
            name: {
                type: GraphQLString,
                // resolve(obj) {
                //     return obj.name.toUpperCase();
                // }
            }
        };
    }
});


const Query = new GraphQLObjectType({
    name: 'Query',
    description: 'Root query object',
    fields: () => {
        return {
            posts: {
                type: new GraphQLList(Post),
                resolve() {
                    return [
                        {
                            name: "fred"
                        }
                    ];
                }
            }
        };
    }
});


const Schema = new GraphQLSchema({
    query: Query
});

export default Schema;
