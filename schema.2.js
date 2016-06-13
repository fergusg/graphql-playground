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

let auth = false;

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
                type: GraphQLString,
                resolve(person) {
                    return person.first_name;
                }
            },
            lastName: {
                type: GraphQLString,
                resolve(person) {
                    return person.last_name;
                }
            },
            email: {
                type: GraphQLString
            },
            posts: {
                type: new GraphQLList(Post),
                resolve(person, args) {
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
                args: {
                    id: {
                        type: GraphQLInt
                    },
                    email: {
                        type: GraphQLString
                    }

                },
                resolve(root, args) {
                    /****** */
                    return Db.models.person.findAll({ where: args });
                }
            },
            posts: {
                type: new GraphQLList(Post),
                args: {
                    id: {
                        type: GraphQLInt
                    }
                },
                resolve(root, args) {
                    /****** */
                    return Db.models.post.findAll({ where: args });
                }
            }
        };
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutations',
    description: 'Functions to set stuff',
    fields: () => {
        return {
            addPerson: {
                type: Person,
                args: {
                    firstName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    lastName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    email: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(source, args) {
                    return Db.models.person.create({
                        first_name: args.firstName,
                        last_name: args.lastName,
                        email: args.email.toLowerCase()
                    });
                }
            }
        };
    }
});

const Schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});

export default Schema;
