import TripListView from '../view/trip-list-view';
import SortView from '../view/sort-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import EmptyListView from '../view/trip-list-empty-view.js';
import PointPresenter from './point-presenter.js';
import {SortType, UpdateType, UserAction} from '../const.js';
import { sortPointDay, sortPointPrice } from '../utils/point';

export default class PointListPresenter {
  #pointListComponent = new TripListView();
  #noPointComponent = new EmptyListView();
  #sortComponent = null;
  #pointListContainer = null;
  #pointsModel = null;
  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;

  constructor(pointListContainer, pointsModel){
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    this.#renderPointList();
  };

  get points () {
    switch (this.#currentSortType) {
      case SortType.DAY:
        return [...this.#pointsModel.points].sort(sortPointDay);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortPointPrice);
    }

    return this.#pointsModel.points;
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPointList();
        this.#renderPointList();
        break;
      case UpdateType.MAJOR:
        this.#clearPointList({resetSortType: true});
        this.#renderPointList();
    }
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
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#pointListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #clearPointList = ({resetSortType = false} = {}) => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#noPointComponent);
    remove(this.#pointListComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderPointList = () => {
    if (this.points.length === 0) {
      this.#renderNoPoint();
      return;
    }
    this.#renderSort();
    this.#renderPointListComponent();
    this.#renderPoints(this.points);
  };

  #renderNoPoint = () => {
    render(this.#noPointComponent, this.#pointListContainer);
  };

  #renderPointListComponent = () => {
    render(this.#pointListComponent, this.#pointListContainer);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent.element, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };
}
