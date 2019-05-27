import {db} from './database';

export function readAllLessonsRoute(req, res) {

  res.status(200).json({lessons: db.readAllLessons()});

}
