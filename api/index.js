const httpServer = require('./src/app.js');
const { conn } = require('./src/db.js');

conn.sync({ force: false }).then(() => {
  httpServer.listen(3001, () => {
    console.log('%s listening at 3001');
  });
});
