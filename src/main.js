import { render } from './framework/render.js';
import FilterView from './view/filter-view.js';
import PointListPresenter from './presenter/point-list-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import { FilterType } from './const.js';

const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const pointListPresenter = new PointListPresenter(tripEventsElement, pointsModel);

render(new FilterView(FilterType.EVERYTHING), tripControlsFiltersElement);

pointListPresenter.init();
