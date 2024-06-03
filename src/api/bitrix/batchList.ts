import type { IBitrix24Library } from 'bitrix24-library';
import getRequestList from './requestList';
import handlerList from './handlerList';

export default class BitrixBatch {
  private readonly isAdmin: boolean;
  private readonly batch: any;
  private readonly requestList: any;

  constructor(BX24: IBitrix24Library) {
    const instanceBatch = BX24.createBatch(handlerList);
    this.batch = instanceBatch.batch.bind(instanceBatch);
    this.isAdmin = BX24.isAdmin();
    this.requestList = getRequestList(this.isAdmin);
  }

  load(entity: string, entityId: string) {
    return this.batch(this.requestList.initParams(entity, entityId));
  }

  getDeal(id: string) {
    return this.batch({
      deal: this.requestList.getDeal(id),
    });
  }

  setTasks(tasks: any[]) {
    const requests = tasks.map(({ fields }) => this.requestList.setTask(fields));
    return this.batch(requests);
  }

  writeComment(array: string[][]) {
    const requests = array.map(([id, message]) => this.requestList.writeComment(id, message));
    return this.batch(requests);
  }

  updateTasks(tasks: any[]) {
    const requests = tasks.map(({ id, fields }) => this.requestList.updateTask(id, fields));
    return this.batch(requests);
  }

  bind(placement: string, name: string) {
    if (this.isAdmin) {
      return this.batch(this.requestList.placementBind(placement, name)).then(
        ({ placementList }: { placementList: IPlacements }) => placementList,
      );
    }
    return Promise.resolve([]);
  }

  unbind(placement: string) {
    if (this.isAdmin) {
      return this.batch(this.requestList.placementUnbind(placement)).then(
        ({ placementList }: { placementList: IPlacements }) => placementList,
      );
    }
    return Promise.resolve([]);
  }
}
