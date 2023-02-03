import getRequestList from './requestList';
import handlerList from './handlerList';

export default class BitrixBatch {
  constructor(BX24, isAdmin = false) {
    const instanceBatch = BX24.createBatch(handlerList);
    this.batch = instanceBatch.batch.bind(instanceBatch);
    this.isAdmin = isAdmin;
    this.requestList = getRequestList(isAdmin);
  }

  load(entity, entityId) {
    return this.batch(this.requestList.initParams(entity, entityId));
  }

  getDeal(id) {
    return this.batch({
      deal: this.requestList.getDeal(id),
    });
  }

  setTasks(tasks) {
    const requests = tasks.map(({ fields }) => this.requestList.setTask(fields));
    return this.batch(requests);
  }

  writeComment(array) {
    const requests = array.map(([id, message]) => this.requestList.writeComment(id, message));
    return this.batch(requests);
  }

  updateTasks(tasks) {
    const requests = tasks.map(({ id, fields }) => this.requestList.updateTask(id, fields));
    return this.batch(requests);
  }

  bind(placement, name) {
    if (this.isAdmin) {
      return this.batch(this.requestList.placementBind(placement, name))
        .then(({ placementList }) => placementList);
    }
    return Promise.resolve([]);
  }

  unbind(placement) {
    if (this.isAdmin) {
      return this.batch(this.requestList.placementUnbind(placement))
        .then(({ placementList }) => placementList);
    }
    return Promise.resolve([]);
  }
}
