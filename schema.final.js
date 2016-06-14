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
                type: GraphQLInt,
                resolve(person) {
                    return person.id;
                }
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
                type: GraphQLString,
                resolve(person) {
                    return person.email;
                }
            },
            posts: {
                type: new GraphQLList(Post),
                args: {
                    limit: {
                        type: GraphQLInt
                    }
                },

                resolve(person, args) {
                    let { limit = -1 } = args;

                    /****** */
                    return person.getPosts({limit});
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
                    ids: {
                        type: new GraphQLList(GraphQLInt)
                    },
                    email: {
                        type: GraphQLString
                    },
                    limit: {
                        type: GraphQLInt
                    }

                },
                resolve(root, args) {
                    if (args.ids) {
                        if (args.id) {
                            args.id = [...args.ids, args.id];
                        } else {
                            args.id = args.ids;
                        }
                        delete args.ids;
                    }

                    if (args.email) {
                        args.email = {
                            $like: `${args.email}`
                        };
                    }
                    let { limit = -1 } = args;
                    delete args.limit;

                    /****** */
                    return Db.models.person.findAll({ where: args, limit });
                }
            },
            posts: {
                type: new GraphQLList(Post),
                args: {
                    id: {
                        type: GraphQLInt
                    },
                    limit: {
                        type: GraphQLInt
                    }
                },
                resolve(root, args) {
                    let { limit = -1 } = args;

                    delete args.limit;
                    /****** */
                    return Db.models.post.findAll({ where: args, limit });
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
                    return new Promise((resolve, reject) => {
                        Db.models.person.create({
                            first_name: args.firstName,
                            last_name: args.lastName,
                            email: args.email.toLowerCase()
                        })
                        .then(resolve)
                        .catch(e => {
                            if (e.errors) {
                                reject(e.errors.map(e => e.message).join(" "));
                            } else {
                                reject(e);
                            }
                        });
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
