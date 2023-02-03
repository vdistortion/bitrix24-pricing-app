import config from '../../config';

console.log([
  {
    method: 'app.info',
    params: {
      AUTH: 'domain/rest/app.info?auth=access_token',
    },
  },
  {
    method: 'placement.get',
    params: {},
  },
  {
    method: 'placement.bind',
    params: {
      PLACEMENT: 'CRM_DEAL_DETAIL_TAB',
      HANDLER: config.path.handler,
      TITLE: 'Расценка',
    },
  },
  {
    method: 'crm.deal.get',
    params: { id: '1488' },
  },
  {
    method: 'crm.deal.productrows.set',
    params: { id: '1488', rows: [] },
  },
  {
    method: 'crm.deal.update',
    params: {
      id: '1488',
      fields: {
        UF_CRM_1429253094: 'Расценка',
        UF_CRM_1486362975: 'Наценка',
      },
      params: {
        REGISTER_SONET_EVENT: 'Y',
      },
    },
  },
  {
    method: 'crm.livefeedmessage.add',
    params: {
      fields: {
        POST_TITLE: 'КП',
        MESSAGE: 'string',
        SPERM: {},
        ENTITYTYPEID: 2,
        ENTITYID: 'id',
      },
    },
  },
  {
    method: 'user.current',
    params: {},
  },
  {
    method: 'user.get',
    params: { ID: 'ID' },
  },
  {
    method: 'tasks.task.get',
    params: { taskId: 'taskID', select: ['ID', 'TITLE'] },
  },
  {
    method: 'tasks.task.update',
    params: {
      taskId: 'taskID',
      fields: {
        DESCRIPTION: '',
        DEADLINE: '1970-01-01',
        CREATED_BY: 'userId',
        RESPONSIBLE_ID: 'userId',
        UF_PRICE_HOUR: 'RATE',
        TIME_ESTIMATE: 900,
      },
    },
  },
  {
    method: 'tasks.task.add',
    params: {
      fields: {
        TITLE: 'name',
        DESCRIPTION: '',
        UF_PRICE_HOUR: 'RATE', // ставка часа, пользовательское
        UF_AUTO_378273429767: 1, // план = факт, пользовательское
        ALLOW_TIME_TRACKING: 'Y',
        TIME_ESTIMATE: 900, // плановое время 15 минут (60*60/4)
        TASK_CONTROL: 'Y', // задача закрывается на контроль
        CREATED_BY: 'userId',
        RESPONSIBLE_ID: 'userId',
        DEADLINE: '1970-01-01',
        UF_CRM_TASK: 'D_ID',
      },
    },
  },
  {
    method: 'tasks.task.complete',
    params: { taskId: 'taskID' },
  },
]);

export default (isAdmin) => ({
  initParams(entity, id) {
    const options = {
      appCode: ['app.info'],
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

  getDeal(id) {
    return {
      method: 'crm.deal.list',
      params: {
        filter: { ID: id },
        select: ['ID', 'TITLE', 'ASSIGNED_BY_ID'],
      },
    };
  },

  setTask(fields) {
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
      request[config.priceHour] = config.rate; // ставка часа, пользовательское
    }

    if (config.planFact) {
      request[config.planFact] = 1; // план = факт, пользовательское
    }

    return request;
  },

  writeComment(id, message) {
    return {
      method: 'task.commentitem.add',
      params: [id, {
        POST_MESSAGE: message,
      }],
    };
  },

  updateTask(id, fields) {
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
      request[config.priceHour] = config.rate; // ставка часа, пользовательское
    }

    if (config.planFact) {
      request[config.planFact] = 1; // план = факт, пользовательское
    }

    return request;
  },

  placementList() {
    return {
      placementList: ['placement.get'],
    };
  },

  placementBind(placement, name) {
    return {
      placementBind: {
        method: 'placement.bind',
        params: {
          PLACEMENT: placement,
          HANDLER: config.path.handler,
          LANG_ALL: {
            en: {
              TITLE: config.global.appNameEng,
            },
            ru: {
              TITLE: name,
            },
          },
        },
      },
      ...this.placementList(),
    };
  },

  placementUnbind(placement) {
    return {
      placementUnbind: {
        method: 'placement.unbind',
        params: {
          PLACEMENT: placement,
          HANDLER: config.path.handler,
        },
      },
      ...this.placementList(),
    };
  },
});
