const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('postgresql://neondb_owner:npg_ex5d8pjoyPAc@ep-divine-recipe-a5tgih1e-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require', {
  dialect: 'postgres',
  timestamps: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true
    }
  }
});



sequelize.authenticate().
  then((response) => {
    console.log('Conexão com o banco estabelecida.');
  }).catch(error => {
    console.error('Erro na conexão:', error);
  })

module.exports = sequelize;