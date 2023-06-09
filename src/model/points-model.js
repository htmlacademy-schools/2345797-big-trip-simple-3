import {generatePoint} from '../mock/point.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #points = Array.from({length: 8}, generatePoint);

  get points() {
    return this.#points;
  }
}
