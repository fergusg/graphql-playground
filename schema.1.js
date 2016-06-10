import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} from 'graphql';

import Db from './db';

const Post = new GraphQLObjectType({
    name: 'Post',
    description: 'Blog post',
    fields: () => {
        return {
            id: {
                type: GraphQLInt
            },
            title: {
                type: GraphQLString
            },
            content: {
                type: GraphQLString
            },
            person: {
                type: Person,
                resolve(post) {
                    /****** */
                    return post.getPerson();
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
                type: GraphQLInt
            },
            firstName: {
                type: GraphQLString
            },
            lastName: {
                type: GraphQLString
            },
            fullName: {
                type: GraphQLString,
                resolve(person) {
                    return `${person.firstName} ${person.lastName}`;
                }
            },
            email: {
                type: GraphQLString
            },
            posts: {
                type: new GraphQLList(Post),
                resolve(person) {
                    /****** */
                    return person.getPosts();
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
                    return Db.models.person.findAll();
                }
            },
            posts: {
                type: new GraphQLList(Post),
                resolve(root, args) {
                    /****** */
                    return Db.models.post.findAll();
                }
            }
        };
    }
});


const Schema = new GraphQLSchema({
    query: Query
});

export default Schema;
