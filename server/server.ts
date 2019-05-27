import * as express from 'express';
import {Application} from 'express';
import {readAllLessonsRoute} from './read-all-lessons.route';
import {addPushSubscriber} from './add-push-subscriber';
import {sendNewsletter} from './send-newslatter.route';

const bodyParser = require('body-parser');
const webpush = require('web-push');
const vapidKeys = {
  publicKey: 'BApAO10ISTLAR1bWho_6f4yL5-5z2RWHgnkqzG7SB81WdcsLkDdxrc1iWwHZ49trIUFekIEFGyBjomxjuKDZGc8',
  privateKey: '7y1-NPiG_igcck_iIJ5sidurBa7ghC4Py0MTQPOFLGM'
};

webpush.setVapidDetails(
  'li@brocelia.fr',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const app: Application = express();

app.use(bodyParser.json());

// REST API
app.route('/api/lessons').get(readAllLessonsRoute);

app.route('/api/notifications').post(addPushSubscriber);

app.route('/api/newsletter').post(sendNewsletter);

// launch an HTTP Server
const httpServer = app.listen(9000, () => {
  console.log('HTTP Server running at http://localhost:' + httpServer.address().port);
});
