import TripListView from '../view/trip-list-view';
import SortView from '../view/sort-view.js';
import { render } from '../framework/render.js';
import EmptyListView from '../view/trip-list-empty-view.js';
import PointPresenter from './point-presenter.js';
import { SortType } from '../const';
import { sortPointDay, sortPointPrice } from '../utils/point';

export default class PointListPresenter {
  #pointListComponent = new TripListView();
  #sortComponent = new SortView();
  #noPointComponent = new EmptyListView();
  #pointListContainer = null;
  #pointsModel = null;
  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;

  constructor(pointListContainer, pointsModel){
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
  }

  get points () {
    switch (this.#currentSortType) {
      case SortType.DAY:
        return [...this.#pointsModel.points].sort(sortPointDay);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortPointPrice);
    }

    return this.#pointsModel.points;
  }

  init = () => {
    this.#renderPointList();
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    // TODO: Вызывать обновление модели
    // this.#pointListPoints = updateItem(this.#pointListPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderPointList();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#pointListContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderNoPoint = () => {
    render(this.#noPointComponent, this.#pointListContainer);
  };

  #renderPointListContainer = () => {
    render(this.#pointListComponent, this.#pointListContainer);
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #renderPointList = () => {
    if (this.points.length === 0) {
      this.#renderNoPoint();
      return;
    }
    this.#renderSort();
    this.#renderPointListContainer();
    this.#renderPoints(this.points);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent.element, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };
}
