import AbstractView from '../framework/view/abstract-view';

const createLoadingTemplate = () => ('<p class="trip-events__msg">Connection error</p>');

export default class ConnectionErrorView extends AbstractView {
  get template() {
    return createLoadingTemplate();
  }
}
