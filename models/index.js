const Pedido = require('./Pedido');
const Pizza = require('./Pizza');
const Usuario = require('./Usuario');

// Define relationships
Pedido.belongsTo(Usuario, { foreignKey: 'usuarioId', targetKey: 'id' });
Pedido.belongsTo(Pizza, { foreignKey: 'pizzaId', targetKey: 'id' });

Usuario.hasMany(Pedido, { foreignKey: 'usuarioId', sourceKey: 'id' });
Pizza.hasMany(Pedido, { foreignKey: 'pizzaId', sourceKey: 'id' });

// Synchronize models with the database
async function syncDatabase() {
  try {
    await Usuario.sync({ force: false });
    await Pizza.sync({ force: false });
    await Pedido.sync({ force: false });

    console.log('Todas as tabelas criadas com sucesso!');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
}

// Run the sync function
syncDatabase();

module.exports = {Pedido, Pizza, Usuario };