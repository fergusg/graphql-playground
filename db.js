import Sequelize, {STRING} from 'sequelize';
import Faker from 'faker';
import _ from 'lodash';

const Conn = new Sequelize(
    null,
    null,
    null,
    {
        dialect: 'sqlite',
        storage: 'db.sqlite'
    }
);

const Person = Conn.define('person', {
    first_name: {
        type: STRING,
        allowNull: false
    },
    last_name: {
        type: STRING,
        allowNull: false
    },
    email: {
        type: STRING,
        validate: {
            isEmail: true
        }
    }
});

const Post = Conn.define('post', {
    title: {
        type: STRING,
        allowNull: false
    },
    content: {
        type: STRING,
        allowNull: false
    }
});

// Relations
Person.hasMany(Post);
Post.belongsTo(Person);

async function createPerson() {
    let person = await Person.create({
        first_name: Faker.name.firstName(),
        last_name: Faker.name.lastName(),
        email: Faker.internet.email()
    });

    _.times(_.random(1,8), (i) => {
        person.createPost({
            title: `Post ${i+1} by ${person.first_name} ${person.last_name}`,
            content: Faker.lorem.paragraphs(3)
        });
    });
}

// Conn.sync({ force: true }).then(() => {
//     _.times(5, createPerson);
// });

export default Conn;
