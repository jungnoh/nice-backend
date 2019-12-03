import createApp from './src/server';

createApp().then((app) => {
  const server = app.listen(3000, () => {
    // tslint:disable-next-line: no-console
    console.log('listening');
  });
});
