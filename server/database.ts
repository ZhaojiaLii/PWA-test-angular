import { LESSONS } from './database_fakedata';
import * as _ from 'lodash';

class InMemoryDatabase {
  readAllLessons() {
    return _.values(LESSONS);
  }
}

export const db = new InMemoryDatabase();
