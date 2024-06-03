import type { BatchRequestType, TRequestObject } from 'bitrix24-library';
import config from '@/config';

const handler = [window.location.origin, window.location.pathname].join('');

export default (isAdmin: boolean) => ({
  initParams(entity: string, id: string): BatchRequestType {
    const options: BatchRequestType = {
      info: ['app.info'],
      currentUser: ['profile'],
      users: {
        method: 'user.get',
        params: {
          ACTIVE: true,
          USER_TYPE: 'employee',
        },
      },
    };

    if (entity === 'task') {
      options.task = {
        method: 'tasks.task.list',
        params: {
          filter: { ID: id },
          select: ['ID', 'TITLE', 'DEADLINE', 'RESPONSIBLE_ID', 'UF_CRM_TASK', config.planFact],
        },
      };
    } else if (entity === 'deal') {
      options.deal = this.getDeal(id);
    }

    if (isAdmin) {
      return {
        ...this.placementList(),
        ...options,
      };
    }

    return options;
  },

  getDeal(id: string): TRequestObject {
    return {
      method: 'crm.deal.list',
      params: {
        filter: { ID: id },
        select: ['ID', 'TITLE', 'ASSIGNED_BY_ID'],
      },
    };
  },

  setTask(fields: any): TRequestObject {
    const request = {
      method: 'tasks.task.add',
      params: {
        fields: {
          ...fields,
          ALLOW_TIME_TRACKING: 'Y',
          TASK_CONTROL: 'Y', // задача закрывается на контроль
          TIME_ESTIMATE: 3600, // плановое время 1 час (60*60)
        },
      },
    };

    if (config.priceHour) {
      request.params.fields[config.priceHour] = config.rate; // ставка часа, пользовательское
    }

    if (config.planFact) {
      request.params.fields[config.planFact] = 1; // план = факт, пользовательское
    }

    return request;
  },

  writeComment(id: string, message: string): TRequestObject {
    return {
      method: 'task.commentitem.add',
      params: [
        id,
        {
          POST_MESSAGE: message,
        },
      ],
    };
  },

  updateTask(id: string, fields: any): TRequestObject {
    const request = {
      method: 'tasks.task.update',
      params: {
        taskId: id,
        fields: {
          ...fields,
          ALLOW_TIME_TRACKING: 'Y',
          TASK_CONTROL: 'Y', // задача закрывается на контроль
          TIME_ESTIMATE: 3600, // плановое время 1 час (60*60)
        },
      },
    };

    if (config.priceHour) {
      request.params.fields[config.priceHour] = config.rate; // ставка часа, пользовательское
    }

    if (config.planFact) {
      request.params.fields[config.planFact] = 1; // план = факт, пользовательское
    }

    return request;
  },

  placementList(): BatchRequestType {
    return {
      placementList: ['placement.get'],
    };
  },

  placementBind(placement: string, name: string): BatchRequestType {
    return {
      placementBind: {
        method: 'placement.bind',
        params: {
          PLACEMENT: placement,
          HANDLER: handler,
          LANG_ALL: {
            ru: {
              TITLE: name,
            },
          },
        },
      },
      ...this.placementList(),
    };
  },

  placementUnbind(placement: string): BatchRequestType {
    return {
      placementUnbind: {
        method: 'placement.unbind',
        params: {
          PLACEMENT: placement,
          HANDLER: handler,
        },
      },
      ...this.placementList(),
    };
  },
});
