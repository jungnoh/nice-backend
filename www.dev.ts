import swaggerUi from 'swagger-ui-express';
import createApp from './src/server';
import swaggerSpec from './swagger';

createApp(true).then((app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.listen(3000, () => {
    // tslint:disable-next-line: no-console
    console.log('listening');
  });
});
