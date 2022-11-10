const {Sequelize,DataTypes} = require("sequelize");

const sequelize = new Sequelize(
 'postgres',
 'postgres',
 'postgres',
  {
    host: 'localhost',
    dialect: 'postgres'
  }
);
sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});


const Overview = sequelize.define('overview',{
    country_id: {
        type: DataTypes.STRING,
      allowNull: false
    },
    governance_id: {
        type: DataTypes.STRING,
      allowNull: false
    }
})

sequelize.sync().then(() => {
  console.log('Book table created successfully!');
}).catch((error) => {
  console.error('Unable to create table : ', error);
});

