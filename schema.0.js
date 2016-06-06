import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} from 'graphql';

import Db from "/db";

const Post = new GraphQLObjectType({
    name: 'Post',
    description: 'Blog post',
    fields: () => {
        return {
            id: {
                type: GraphQLInt,
                resolve(post) {
                    return post.id;
                }
            },
            title: {
                type: GraphQLString,
                resolve(post) {
                    return post.title;
                }
            },
            content: {
                type: GraphQLString,
                resolve(post) {
                    return post.content;
                }
            },
            person: {
                type: Person,
                resolve(post) {
                    /****** */
                    {};
                }
            }
        };
    }
});

const Person = new GraphQLObjectType({
    name: 'Person',
    description: 'This represents a Person',
    fields: () => {
        return {
            id: {
                type: GraphQLInt,
                resolve(person) {
                    return person.id;
                }
            },
            firstName: {
                type: GraphQLString,
                resolve(person) {
                    return person.firstName;
                }
            },
            lastName: {
                type: GraphQLString,
                resolve(person) {
                    return person.lastName;
                }
            },
            email: {
                type: GraphQLString,
                resolve(person) {
                    return person.email;
                }
            },
            posts: {
                type: new GraphQLList(Post),
                resolve(person, args) {
                    /****** */
                    return [];
                }
            }
        };
    }
});

const Query = new GraphQLObjectType({
    name: 'Query',
    description: 'Root query object',
    fields: () => {
        return {
            people: {
                type: new GraphQLList(Person),
                resolve(root, args) {
                    /****** */
                    return [];
                }
            },
            posts: {
                type: new GraphQLList(Post),
                resolve(root, where) {
                    /****** */
                    return [];
                }
            }
        };
    }
});


const Schema = new GraphQLSchema({
    query: Query
});

export default Schema;
